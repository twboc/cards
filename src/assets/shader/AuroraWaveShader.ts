const AuroraWaveShader = `
uniform float2 iResolution;
uniform float iTime;

vec3 palette(float t) {
    vec3 a = vec3(0.45, 0.55, 0.65);
    vec3 b = vec3(0.35, 0.25, 0.45);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.05, 0.2, 0.35);
    return a + b * cos(6.28318 * (c * t + d));
}

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

half4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec2 p = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;

    float t = iTime * 0.22;

    float n1 = fbm(vec2(p.x * 1.6, p.y * 2.5 + t));
    float n2 = fbm(vec2(p.x * 2.8 - t * 0.7, p.y * 3.5 - t * 0.2));

    float band1 = smoothstep(0.18, 0.0, abs(p.y + 0.25 * sin(p.x * 2.0 + t) - n1 * 0.35));
    float band2 = smoothstep(0.22, 0.0, abs(p.y - 0.15 * sin(p.x * 2.8 - t * 1.2) - n2 * 0.28));

    vec3 aurora1 = palette(n1 + p.x * 0.15 + t) * band1;
    vec3 aurora2 = palette(n2 + 0.4 + p.x * 0.08 - t * 0.5) * band2;

    // float stars = pow(noise(uv * iResolution.xy * 0.18 + iTime * 0.03), 24.0);

    vec3 sky = mix(vec3(0.01, 0.02, 0.05), vec3(0.02, 0.05, 0.10), uv.y);
    // vec3 color = sky + aurora1 + aurora2 + vec3(stars) * 0.9;
    vec3 color = sky + aurora1 + aurora2 * 0.9;
    color = 1.0 - exp(-color * 1.4);

    return vec4(color, 1.0);
}`;
export { AuroraWaveShader };
