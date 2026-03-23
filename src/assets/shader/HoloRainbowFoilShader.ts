const HoloRainbowFoilShader = `
uniform float2 iResolution;
uniform float iTime;

vec3 palette(float t) {
    vec3 a = vec3(0.55, 0.55, 0.55);
    vec3 b = vec3(0.45, 0.35, 0.40);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.00, 0.15, 0.30);
    return a + b * cos(6.28318 * (c * t + d));
}

float sparkle(vec2 p, float scale) {
    vec2 gv = fract(p * scale) - 0.5;
    vec2 id = floor(p * scale);
    float n = fract(sin(dot(id, vec2(127.1, 311.7))) * 43758.5453);
    float d = length(gv - vec2(n - 0.5, fract(n * 7.13) - 0.5) * 0.35);
    return smoothstep(0.08, 0.0, d) * step(0.82, n);
}

half4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec2 p = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
    float t = iTime * 0.55;

    float angle = atan(p.y, p.x);
    float radius = length(p);

    float diagonal = uv.x * 1.2 + uv.y * 0.8;
    float rainbowBand = sin(diagonal * 18.0 - t * 4.0);
    float waveBand = sin((uv.x - uv.y) * 24.0 + t * 2.5);
    float shimmer = pow(max(0.0, rainbowBand * 0.5 + waveBand * 0.5), 3.0);

    float radialFoil = sin(radius * 28.0 - t * 3.0 + angle * 2.0);
    float foilMask = 0.4 + 0.6 * smoothstep(-0.2, 0.8, radialFoil);

    float glint = smoothstep(0.98, 1.0, sin(diagonal * 8.0 - t * 2.0));
    glint += smoothstep(0.985, 1.0, sin(diagonal * 22.0 + t * 1.8));
    glint = min(glint, 1.4);

    float s1 = sparkle(uv + t * 0.05, 22.0);
    float s2 = sparkle(uv * 1.4 - t * 0.03, 34.0);
    float sparkles = s1 + s2;

    vec3 rainbow = palette(diagonal * 0.65 + radius * 0.8 - t * 0.2);
    vec3 base = mix(vec3(0.06, 0.08, 0.14), vec3(0.20, 0.24, 0.32), uv.y);

    vec3 color = base;
    color += rainbow * shimmer * 1.25;
    color += rainbow * foilMask * 0.35;
    color += vec3(1.0, 1.0, 1.0) * glint * 0.75;
    color += rainbow * sparkles * 1.6;

    color *= 1.0 - radius * 0.18;
    color = 1.0 - exp(-color * 1.15);

    return vec4(color, 1.0);
}`;
export { HoloRainbowFoilShader };
