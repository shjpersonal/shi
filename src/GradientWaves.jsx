import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from './ogl'
import './GradientWaves.css'

const rgb = (hex) => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return match ? [1, 2, 3].map((i) => parseInt(match[i], 16) / 255) : [1, 1, 1]
}

const vertex = `#version 300 es
in vec2 position;
void main(){gl_Position=vec4(position,0.,1.);}`

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution,uMouse;
uniform float iTime,uSpeed,uAmplitude,uWaveScale,uWaveRatio,uSwell,uTurbulence,uTilt,uZoom,uHeight,uFogDepth,uSteps,uBrightness,uOpacity,uGrain,uGrainIntensity,uParallax;
uniform bool uEnableMouse;
uniform vec3 uHorizonColor,uWaveColor,uCrestColor;
out vec4 fragColor;
float hash21(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float plasma(vec3 r,vec2 f,vec4 tc){float x=r.x+tc.x;x+=uSwell*sin((r.y+x)/20.+tc.y);float y=r.y-tc.z;y+=uTurbulence*cos(r.x/23.+tc.w);return r.z-(sin(x*f.x)*uAmplitude+sin(y*f.y)*uAmplitude+uHeight);}
float march(vec3 p,vec3 d,vec2 f,vec4 tc){float dist=0.;for(int i=0;i<128;i++){if(float(i)>=uSteps)break;float s=plasma(p+dist*d,f,tc);if(abs(s)<.1)break;dist+=.9*s;if(abs(dist)>=20000.)return 20000.;}return dist;}
void main(){
 float T=iTime*uSpeed;vec2 f=vec2(uWaveScale/7.,uWaveScale*uWaveRatio/3.);vec4 tc=vec4(T/.130,T/.810,T/.200,T/.710);
 float c,s;float vfov=(3.14159/2.3)/max(uZoom,.05);vec3 cam=vec3(0.,0.,30.);vec2 uv=gl_FragCoord.xy/iResolution.xy-.5;uv.x*=iResolution.x/iResolution.y;uv.y*=-1.;
 vec3 dir=vec3(0.,0.,-1.);float len=length(uv),rot=vfov*len;c=cos(rot);s=sin(rot);dir=mat3(1.,0.,0.,0.,c,-s,0.,s,c)*dir;vec2 n=len>1e-5?uv/len:vec2(1.,0.);c=n.x;s=n.y;dir=mat3(c,-s,0.,s,c,0.,0.,0.,1.)*dir;c=cos(uTilt);s=sin(uTilt);dir=mat3(c,0.,s,0.,1.,0.,-s,0.,c)*dir;
 if(uEnableMouse){float yaw=(uMouse.x-.5)*uParallax*.4,pitch=(uMouse.y-.5)*uParallax*.4;c=cos(yaw);s=sin(yaw);dir=mat3(c,0.,s,0.,1.,0.,-s,0.,c)*dir;c=cos(pitch);s=sin(pitch);dir=mat3(1.,0.,0.,0.,c,-s,0.,s,c)*dir;}
 float dist=march(cam,dir,f,tc);vec3 pos=cam+dist*dir;float fog=clamp(uFogDepth/max(dist,.001),0.,1.);vec3 body=mix(uWaveColor,uCrestColor,clamp(pos.z*.08+.5,0.,1.));vec3 col=clamp(mix(uHorizonColor,body,fog)*uBrightness,0.,1.);float a=fog*uOpacity;if(uGrain>.5)a+=(hash21(gl_FragCoord.xy+mod(iTime,64.)*11.)-.5)*uGrainIntensity;a=clamp(a,0.,1.);fragColor=vec4(col*a,a);
}`

const steps = { low: 40, medium: 70, high: 110 }

export default function GradientWaves({ horizonColor='#5227ff', waveColor='#ff9ffc', crestColor='#fff', speed=.4, amplitude=2.5, waveScale=.6, waveRatio=.9, swell=35, turbulence=20, tilt=1.11, zoom=1, height=5.5, fogDepth=15, detail='medium', brightness=1, opacity=1, mouseInteraction=true, parallaxStrength=.5, grain=true, grainIntensity=.05, className='' }) {
  const ref = useRef(null)
  useEffect(() => {
    const container = ref.current
    const renderer = new Renderer({ webgl:2, alpha:true, premultipliedAlpha:true, antialias:false, dpr:Math.min(devicePixelRatio||1,2) })
    const gl = renderer.gl
    gl.clearColor(0,0,0,0)
    container.appendChild(gl.canvas)
    const uniforms = {
      iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uMouse:{value:new Float32Array([.5,.5])},
      uSpeed:{value:speed},uAmplitude:{value:amplitude},uWaveScale:{value:waveScale},uWaveRatio:{value:waveRatio},uSwell:{value:swell},uTurbulence:{value:turbulence},uTilt:{value:tilt},uZoom:{value:zoom},uHeight:{value:height},uFogDepth:{value:fogDepth},uSteps:{value:steps[detail]||70},uBrightness:{value:brightness},uOpacity:{value:opacity},uGrain:{value:grain?1:0},uGrainIntensity:{value:grainIntensity},uParallax:{value:parallaxStrength},uEnableMouse:{value:mouseInteraction},uHorizonColor:{value:new Float32Array(rgb(horizonColor))},uWaveColor:{value:new Float32Array(rgb(waveColor))},uCrestColor:{value:new Float32Array(rgb(crestColor))}
    }
    const program = new Program(gl,{vertex,fragment,uniforms})
    const mesh = new Mesh(gl,{geometry:new Triangle(gl),program})
    const size = () => { const box=container.getBoundingClientRect();renderer.setSize(Math.max(1,box.width),Math.max(1,box.height));uniforms.iResolution.value[0]=gl.drawingBufferWidth;uniforms.iResolution.value[1]=gl.drawingBufferHeight }
    const ro = new ResizeObserver(size);ro.observe(container);size()
    const target=[.5,.5],current=[.5,.5]
    const move = e => { const box=gl.canvas.getBoundingClientRect();target[0]=(e.clientX-box.left)/box.width;target[1]=1-(e.clientY-box.top)/box.height }
    const leave = () => { target[0]=.5;target[1]=.5 }
    gl.canvas.addEventListener('pointermove',move);gl.canvas.addEventListener('pointerleave',leave)
    let raf=0,visible=true,pageVisible=!document.hidden,start=performance.now()
    const loop = t => { uniforms.iTime.value=(t-start)*.001;current[0]+=.05*(target[0]-current[0]);current[1]+=.05*(target[1]-current[1]);uniforms.uMouse.value.set(current);renderer.render({scene:mesh});raf=requestAnimationFrame(loop) }
    const play=()=>{if(visible&&pageVisible&&!raf)raf=requestAnimationFrame(loop)}
    const stop=()=>{cancelAnimationFrame(raf);raf=0}
    const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;visible?play():stop()});io.observe(container)
    const visibility=()=>{pageVisible=!document.hidden;pageVisible?play():stop()};document.addEventListener('visibilitychange',visibility);play()
    return()=>{stop();ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',visibility);gl.canvas.removeEventListener('pointermove',move);gl.canvas.removeEventListener('pointerleave',leave);gl.getExtension('WEBGL_lose_context')?.loseContext();container.replaceChildren()}
  }, [horizonColor,waveColor,crestColor,speed,amplitude,waveScale,waveRatio,swell,turbulence,tilt,zoom,height,fogDepth,detail,brightness,opacity,mouseInteraction,parallaxStrength,grain,grainIntensity])
  return <div ref={ref} className={`gradient-waves-container ${className}`.trim()} aria-hidden="true" />
}
