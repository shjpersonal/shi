import { useEffect, useRef } from 'react'
import './Iridescence.css'

const vertexShader = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0, 1);
}`

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;
varying vec2 vUv;
void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
  uv += (uMouse - vec2(0.5)) * uAmplitude;
  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}`

export default function Iridescence({ color = [1, 1, 1], speed = 1, amplitude = 0.1, mouseReact = true, className = '' }) {
  const containerRef = useRef(null)
  const mousePos = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    if (!containerRef.current) return undefined
    const container = containerRef.current
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) return undefined
    gl.clearColor(0, 0, 0, 1)

    const compile = (type, source) => {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      return shader
    }
    const vertex = compile(gl.VERTEX_SHADER, vertexShader)
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentShader)
    const program = gl.createProgram()
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    gl.useProgram(program)
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const uniforms = {
      time: gl.getUniformLocation(program, 'uTime'),
      color: gl.getUniformLocation(program, 'uColor'),
      resolution: gl.getUniformLocation(program, 'uResolution'),
      mouse: gl.getUniformLocation(program, 'uMouse'),
      amplitude: gl.getUniformLocation(program, 'uAmplitude'),
      speed: gl.getUniformLocation(program, 'uSpeed'),
    }
    gl.uniform3fv(uniforms.color, color)
    gl.uniform1f(uniforms.amplitude, amplitude)
    gl.uniform1f(uniforms.speed, speed)

    let hasSized = false
    const resize = () => {
      const dprLimit = window.innerWidth <= 768 ? 1 : 1.35
      const dpr = Math.min(window.devicePixelRatio || 1, dprLimit)
      canvas.width = Math.max(1, Math.round(container.offsetWidth * dpr))
      canvas.height = Math.max(1, Math.round(container.offsetHeight * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform3f(uniforms.resolution, canvas.width, canvas.height, canvas.width / canvas.height)
      hasSized = true
    }

    let frame = 0
    let inViewport = false
    let pageVisible = !document.hidden
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const update = (time) => {
      if (!inViewport || !pageVisible || reducedMotion) {
        frame = 0
        return
      }
      frame = requestAnimationFrame(update)
      gl.uniform1f(uniforms.time, time * 0.001)
      gl.uniform2f(uniforms.mouse, mousePos.current.x, mousePos.current.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    const renderStaticFrame = () => {
      gl.uniform1f(uniforms.time, 0)
      gl.uniform2f(uniforms.mouse, mousePos.current.x, mousePos.current.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    const syncAnimation = () => {
      if (inViewport && !hasSized) resize()
      if (!inViewport || !pageVisible) {
        if (frame) cancelAnimationFrame(frame)
        frame = 0
        return
      }
      if (reducedMotion) {
        renderStaticFrame()
        return
      }
      if (!frame) frame = requestAnimationFrame(update)
    }
    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = 1 - (event.clientY - rect.top) / rect.height
      mousePos.current = { x, y }
    }
    gl.uniform2f(uniforms.mouse, 0.5, 0.5)
    container.appendChild(canvas)
    if (mouseReact) container.addEventListener('mousemove', handleMouseMove)
    const resizeObserver = new ResizeObserver(() => {
      if (!inViewport) return
      resize()
      if (reducedMotion) renderStaticFrame()
    })
    resizeObserver.observe(container)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting
      syncAnimation()
    }, { rootMargin: '160px 0px', threshold: 0 })
    intersectionObserver.observe(container)
    const handleVisibilityChange = () => {
      pageVisible = !document.hidden
      syncAnimation()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (mouseReact) container.removeEventListener('mousemove', handleMouseMove)
      if (canvas.parentNode === container) container.removeChild(canvas)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [color[0], color[1], color[2], speed, amplitude, mouseReact])

  return <div ref={containerRef} className={`iridescence-container ${className}`.trim()} aria-hidden="true" />
}
