const HoloCosmicGalaxyShader = `
uniform float2 iResolution;
uniform float iTime;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
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
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

vec3 palette(float t) {
    vec3 a = vec3(0.46, 0.48, 0.55);
    vec3 b = vec3(0.42, 0.32, 0.45);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.00, 0.18, 0.30);
    return a + b * cos(6.28318 * (c * t + d));
}

half4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec2 p = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
    float t = iTime * 0.35;

    float n1 = fbm(p * 2.8 + vec2(t, -t * 0.6));
    float n2 = fbm(p * 5.2 - vec2(t * 0.5, -t * 0.8));
    float nebula = smoothstep(0.35, 0.95, n1 * 0.7 + n2 * 0.5);

    float starField = pow(noise(uv * iResolution.xy * 0.22 + t * 0.1), 28.0);
    float prismSweep = smoothstep(0.7, 1.0, sin((uv.x * 1.15 + uv.y * 0.9) * 12.0 - t * 4.0));
    float prismSweep2 = smoothstep(0.78, 1.0, sin((uv.x - uv.y) * 18.0 + t * 2.8));

    vec3 holo = palette(n1 + n2 * 0.3 + length(p) * 0.8 - t * 0.12);
    vec3 bg = mix(vec3(0.03, 0.03, 0.07), vec3(0.07, 0.08, 0.14), uv.y);

    vec3 color = bg;
    color += holo * nebula * 0.95;
    color += holo * prismSweep * 0.55;
    color += vec3(0.95, 0.98, 1.0) * prismSweep2 * 0.25;
    color += vec3(starField) * 1.2;

    float vignette = smoothstep(1.45, 0.25, length(p));
    color *= vignette;
    color = 1.0 - exp(-color * 1.3);

    return vec4(color, 1.0);
}`;
export { HoloCosmicGalaxyShader };
