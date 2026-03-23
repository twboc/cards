const HoloPrismBurstShader = `
uniform float2 iResolution;
uniform float iTime;

vec2 rot(vec2 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c) * p;
}

vec3 palette(float t) {
    vec3 a = vec3(0.50, 0.52, 0.55);
    vec3 b = vec3(0.45, 0.40, 0.42);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.00, 0.14, 0.28);
    return a + b * cos(6.28318 * (c * t + d));
}

float prism(vec2 p, float sides) {
    float a = atan(p.y, p.x);
    float r = length(p);
    float sector = cos(a * sides);
    return abs(sector) / (1.0 + r * 7.0);
}

half4 main(vec2 fragCoord) {
    vec2 p = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
    vec2 q = rot(p, iTime * 0.25);

    float t = iTime * 0.6;
    float prismA = prism(q, 6.0);
    float prismB = prism(rot(q, 0.65), 12.0);

    float burst = pow(prismA * 0.9 + prismB * 0.55, 2.8);
    float rings = pow(abs(sin(length(p) * 30.0 - t * 4.0)), 10.0) * 0.22;
    float sweep = smoothstep(0.84, 1.0, sin((p.x - p.y) * 10.0 + t * 2.0));

    vec3 holo = palette(length(p) * 0.75 + atan(p.y, p.x) * 0.2 - t * 0.18);
    vec3 bg = vec3(0.03, 0.04, 0.08);

    vec3 color = bg;
    color += holo * burst * 1.4;
    color += holo * rings * 0.9;
    color += vec3(1.0, 0.97, 1.0) * sweep * 0.28;

    color = 1.0 - exp(-color * 1.22);

    return vec4(color, 1.0);
}`;
export { HoloPrismBurstShader };
