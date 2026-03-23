const CrystalBloomShader = `
uniform float2 iResolution;
uniform float iTime;

vec2 rot(vec2 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c) * p;
}

float sdDiamond(vec2 p, float r) {
    p = abs(p);
    return (p.x + p.y) - r;
}

vec3 palette(float t) {
    vec3 a = vec3(0.40, 0.42, 0.48);
    vec3 b = vec3(0.30, 0.38, 0.45);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.55, 0.15, 0.05);
    return a + b * cos(6.28318 * (c * t + d));
}

half4 main(vec2 fragCoord) {
    vec2 p = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
    float t = iTime * 0.55;

    vec3 color = vec3(0.01, 0.015, 0.03);

    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        vec2 q = rot(p, t * 0.2 + fi * 1.0472);
        q *= 1.0 + fi * 0.12;

        float d = sdDiamond(q + vec2(0.0, 0.12 * sin(t + fi)), 0.32 + 0.02 * fi * 20);
        float edge = 0.012 / (abs(d) + 0.003);
        float glow = 0.02 / (abs(d) + 0.025);

        vec3 col = palette(fi * 0.18 + t * 0.1 + length(p) * 0.7);
        color += col * edge;
        color += col * glow * 0.35;
    }

    float burst = pow(max(0.0, 1.0 - length(p) * 1.1), 3.0) * (0.5 + 0.5 * sin(t * 2.5));
    color += vec3(0.2, 0.35, 0.9) * burst * 0.4;

    return vec4(color, 1.0);
}`;
export { CrystalBloomShader };
