const compile = (gl, type, source) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile failed')
  return shader
}

export class Renderer {
  constructor({ webgl = 2, alpha = true, premultipliedAlpha = true, antialias = false, dpr = 1 } = {}) {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext(webgl === 2 ? 'webgl2' : 'webgl', { alpha, premultipliedAlpha, antialias })
    if (!gl) throw new Error('WebGL 2 is not supported by this browser')
    this.gl = gl
    this.dpr = dpr
  }
  setSize(width, height) {
    const { gl, dpr } = this
    gl.canvas.width = Math.round(width * dpr)
    gl.canvas.height = Math.round(height * dpr)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  }
  render({ scene }) { scene.draw() }
}

export class Program {
  constructor(gl, { vertex, fragment, uniforms = {} }) {
    this.gl = gl
    this.uniforms = uniforms
    const program = gl.createProgram()
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertex))
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragment))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Shader link failed')
    this.program = program
    this.locations = new Map()
  }
  use() {
    const { gl, program } = this
    gl.useProgram(program)
    Object.entries(this.uniforms).forEach(([name, uniform]) => {
      if (!this.locations.has(name)) this.locations.set(name, gl.getUniformLocation(program, name))
      const location = this.locations.get(name)
      if (location === null) return
      const value = uniform.value
      if (typeof value === 'boolean') gl.uniform1i(location, value ? 1 : 0)
      else if (typeof value === 'number') gl.uniform1f(location, value)
      else if (value.length === 2) gl.uniform2fv(location, value)
      else if (value.length === 3) gl.uniform3fv(location, value)
      else if (value.length === 4) gl.uniform4fv(location, value)
    })
  }
}

export class Triangle {
  constructor(gl) {
    this.gl = gl
    this.buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  }
  bind(program) {
    const { gl } = this
    const location = gl.getAttribLocation(program.program, 'position')
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    gl.enableVertexAttribArray(location)
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0)
  }
}

export class Mesh {
  constructor(gl, { geometry, program }) { this.gl = gl; this.geometry = geometry; this.program = program }
  draw() {
    this.program.use()
    this.geometry.bind(this.program)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3)
  }
}
