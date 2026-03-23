const HoloSilverScanShader = `
uniform float2 iResolution;
uniform float iTime;

vec3 palette(float t) {
    vec3 a = vec3(0.62, 0.62, 0.65);
    vec3 b = vec3(0.28, 0.20, 0.32);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.00, 0.10, 0.20);
    return a + b * cos(6.28318 * (c * t + d));
}

float linePattern(vec2 uv, float freq, float speed) {
    float v = sin((uv.x * 0.75 + uv.y * 1.15) * freq - iTime * speed);
    return smoothstep(0.72, 1.0, v);
}

float sparkleGrid(vec2 uv) {
    vec2 id = floor(uv * 50.0);
    float n = fract(sin(dot(id, vec2(91.7, 173.3))) * 41941.1257);
    float blink = 0.5 + 0.5 * sin(iTime * 4.0 + n * 20.0);
    return step(0.972, n) * blink;
}

half4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec2 p = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;

    float t = iTime * 0.55;
    float radius = length(p);

    float scan1 = linePattern(uv, 24.0, 2.4);
    float scan2 = linePattern(uv.yx + 0.13, 38.0, -1.8);
    float scan3 = linePattern(uv + vec2(0.0, 0.2), 62.0, 3.2);

    float foil = scan1 * 0.55 + scan2 * 0.35 + scan3 * 0.22;
    float shineSweep = smoothstep(0.86, 1.0, sin((uv.x + uv.y * 0.6) * 14.0 - t * 3.0));
    // float sparkles = sparkleGrid(uv);

    vec3 silver = mix(vec3(0.10, 0.11, 0.14), vec3(0.78, 0.82, 0.90), foil);
    vec3 rainbowTint = palette(uv.x * 0.8 + uv.y * 0.6 - t * 0.12);

    vec3 color = silver;
    color += rainbowTint * foil * 0.42;
    color += vec3(1.0) * shineSweep * 0.45;
    // color += rainbowTint * sparkles * 1.8;
    color += rainbowTint  * 1.8;

    color *= 1.0 - radius * 0.16;
    color = 1.0 - exp(-color * 1.18);

    return vec4(color, 1.0);
}`;
export { HoloSilverScanShader };
