const LiquidMetalColourShader = `
uniform float2 iResolution;
uniform float iTime;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.0, 289.0))) * 45758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 6; i++) {
        sum += noise(p) * amp;
        p = mat2(1.6, -1.2, 1.2, 1.6) * p;
        amp *= 0.52;
    }
    return sum;
}

vec3 palette(float t) {
    vec3 a = vec3(0.55, 0.55, 0.60);
    vec3 b = vec3(0.45, 0.45, 0.40);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.00, 0.18, 0.38);
    return a + b * cos(6.28318 * (c * t + d));
}

half4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec2 p = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
    float t = iTime * 0.55;

    vec2 q = p;
    q += 0.22 * vec2(
        sin(p.y * 4.4 + t * 1.6),
        cos(p.x * 4.8 - t * 1.25)
    );

    float n = fbm(q * 3.2 + vec2(t, -t * 0.85));
    float shine = smoothstep(0.34, 0.88, n);

    float ridge = pow(abs(sin(n * 11.5 + t * 2.4)), 9.0);
    float micro = pow(abs(sin(n * 22.0 - t * 1.8)), 16.0);
    float glow = smoothstep(0.55, 1.0, ridge + micro * 0.6);

    vec3 metalBase = mix(
        vec3(0.03, 0.04, 0.06),
        vec3(0.82, 0.88, 0.96),
        shine
    );

    vec3 neonA = vec3(0.12, 0.95, 1.00);
    vec3 neonB = vec3(1.00, 0.10, 0.82);
    vec3 neonC = vec3(0.48, 0.18, 1.00);

    float phase1 = 0.5 + 0.5 * sin(t * 1.2 + n * 7.0 + p.x * 2.0);
    float phase2 = 0.5 + 0.5 * cos(t * 0.9 + n * 9.0 - p.y * 2.4);

    vec3 tint = mix(neonA, neonB, phase1);
    tint = mix(tint, neonC, phase2 * 0.55);

    vec3 rainbow = palette(n * 0.9 + t * 0.22 + p.x * 0.15);
    rainbow = mix(tint, rainbow, 0.35);

    vec3 color = metalBase;
    color += rainbow * ridge * 0.72;
    color += vec3(0.10, 0.75, 1.00) * micro * 0.28;
    color += rainbow * glow * 0.18;

    float vignette = smoothstep(1.45, 0.22, length(p));
    color *= vignette;

    // contrast and neon punch
    color = pow(color, vec3(0.9));
    color *= 1.18;

    return vec4(color, 1.0);
}`;
export { LiquidMetalColourShader };
