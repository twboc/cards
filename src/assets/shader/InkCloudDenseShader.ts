const InkCloudDenseShader = `
uniform float2 iResolution;
uniform float iTime;

float hash21(vec2 p){
    p = fract(p * vec2(123.34,345.45));
    p += dot(p,p+34.345);
    return fract(p.x*p.y);
}

mat2 rot(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c,-s,s,c);
}

float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash21(i);
    float b = hash21(i+vec2(1.0,0.0));
    float c = hash21(i+vec2(0.0,1.0));
    float d = hash21(i+vec2(1.0,1.0));

    vec2 u = f*f*(3.0-2.0*f);

    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;

    for(int i=0;i<7;i++){
        v += a * noise(p);
        p = rot(0.42) * p * 2.1 + vec2(17.2,9.8);
        a *= 0.55;
    }
    return v;
}

vec3 palette(float t){
    vec3 c1 = vec3(0.02,0.86,0.95);
    vec3 c2 = vec3(1.00,0.70,0.05);
    vec3 c3 = vec3(1.00,0.05,0.55);
    vec3 c4 = vec3(0.62,0.18,0.90);

    if(t < 0.33){
        return mix(c1,c2,smoothstep(0.0,0.33,t));
    }else if(t < 0.66){
        return mix(c2,c3,smoothstep(0.33,0.66,t));
    }
    return mix(c3,c4,smoothstep(0.66,1.0,t));
}

half4 main(vec2 fragCoord){

    vec2 p = (fragCoord*2.0 - iResolution.xy) / iResolution.y;

    float t = iTime * 0.14;

    // MUCH WIDER CLOUD SHAPE
    vec2 q = p;
    q.x *= 0.75;
    q.y *= 1.05;

    vec2 flow = vec2(
        fbm(q*1.4 + vec2(t*0.8,-t*0.2)),
        fbm(q*1.4 + vec2(8.1 - t*0.4,3.7 + t*0.4))
    );

    vec2 warped = q;
    warped += (flow - 0.5) * 1.05;
    warped += 0.25 * vec2(
        fbm(q*3.0 + vec2(1.2,5.4) + t),
        fbm(q*3.0 + vec2(7.8,2.1) - t)
    );

    // VERY WIDE BACKBONE
    float ribbon = exp(-pow(q.y*1.4,2.0));
    ribbon *= 0.9 + 0.25*sin(q.x*2.0 - t*4.0);

    float d1 = fbm(warped*2.0);
    float d2 = fbm(warped*3.5);
    float d3 = fbm(warped*6.0);

    float smoke = d1*0.6 + d2*0.3 + d3*0.2;
    smoke = smoothstep(0.30,0.90,smoke);

    float wisps = fbm(warped*8.0 + vec2(t*0.5,-t*0.2));
    wisps = smoothstep(0.45,0.85,wisps);

    float density = smoke * ribbon;
    density += wisps * ribbon * 0.5;

    // BIG GLOBAL PUFF VOLUME
    float lobe1 = exp(-length((q-vec2(-0.9,0.0))*vec2(1.2,1.8)));
    float lobe2 = exp(-length((q-vec2(-0.2,0.0))*vec2(1.3,2.0)));
    float lobe3 = exp(-length((q-vec2(0.5,0.0))*vec2(1.4,2.2)));
    float lobe4 = exp(-length((q-vec2(1.1,0.0))*vec2(1.6,2.4)));

    density *= 0.9 + (lobe1 + lobe2 + lobe3 + lobe4);

    // MUCH SOFTER EDGE FADE → fills screen
    float edgeFade = 1.0 - smoothstep(1.6, 2.6, length(q*vec2(0.8,1.0)));
    density *= edgeFade;

    float band = smoothstep(-1.4,1.4,q.x);
    band += 0.15*(flow.x-0.5);
    band += 0.08*sin(q.y*6.0 + fbm(q*4.0)*6.2831);
    band = clamp(band,0.0,1.0);

    vec3 col = palette(band);

    float innerGlow = smoothstep(0.2,1.0,density);
    vec3 bright = mix(col,vec3(1.0),innerGlow*0.18);

    // MUCH HIGHER OPACITY
    float alpha = smoothstep(0.02,0.65,density);
    alpha *= 1.15;

    vec3 finalColor = bright + vec3(1.0)*density*0.08;

    return vec4(finalColor, alpha);
}
`;
export { InkCloudDenseShader };
