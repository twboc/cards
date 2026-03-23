const LiquidMetalShader = `
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

half4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec2 p = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
    float t = iTime * 0.4;

    vec2 q = p;
    q += 0.18 * vec2(
        sin(p.y * 4.0 + t * 1.4),
        cos(p.x * 4.5 - t * 1.1)
    );

    float n = fbm(q * 3.0 + vec2(t, -t * 0.8));
    float shine = smoothstep(0.38, 0.86, n);
    float ridge = pow(abs(sin(n * 10.0 + t * 2.0)), 8.0);

    vec3 metalBase = mix(
        vec3(0.07, 0.08, 0.10),
        vec3(0.75, 0.80, 0.88),
        shine
    );

    vec3 tint = mix(
        vec3(0.25, 0.35, 0.75),
        vec3(0.15, 0.95, 0.85),
        0.5 + 0.5 * sin(t + n * 6.0)
    );

    vec3 color = metalBase + tint * ridge * 0.45;

    float vignette = smoothstep(1.4, 0.25, length(p));
    color *= vignette;

    return vec4(color, 1.0);
}`;
export { LiquidMetalShader };
