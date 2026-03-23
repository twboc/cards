const TronGridHorizonShader = `
uniform float2 iResolution;
uniform float iTime;

float lineGlow(float d, float width) {
    return pow(clamp(width / max(d, 0.0001), 0.0, 1.0), 1.8);
}

half4 main(vec2 fragCoord) {

    vec2 uv = fragCoord / iResolution.xy;

    // ⭐ FLIPPED vertically here
    vec2 p = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
    p.y *= -1.0;

    float t = iTime * 1.8;

    float horizon = -0.08;

    vec3 skyTop = vec3(0.01, 0.03, 0.08);
    vec3 skyBottom = vec3(0.00, 0.00, 0.02);

    float skyMix = smoothstep(-1.0, horizon + 0.35, p.y);
    vec3 color = mix(skyBottom, skyTop, skyMix);

    float horizonGlow = exp(-abs(p.y - horizon) * 18.0);
    color += vec3(0.0, 0.55, 1.0) * horizonGlow * 0.22;

    if (p.y < horizon) {

        float depth = 1.0 / max(horizon - p.y, 0.03);

        float z = depth * 0.22 + t;
        float x = p.x * depth;

        float gx = abs(fract(x) - 0.5);
        float gridX = lineGlow(gx, 0.045);

        float gz = abs(fract(z) - 0.5);
        float gridZ = lineGlow(gz, 0.06);

        float fade = smoothstep(0.0, 0.9, horizon - p.y);
        fade = 1.0 - fade * 0.75;

        vec3 floorBase = vec3(0.0, 0.03, 0.07);

        vec3 gridColorA = vec3(0.0, 0.85, 1.0);
        vec3 gridColorB = vec3(0.15, 0.35, 1.0);

        float grid = gridX + gridZ * 1.2;

        vec3 floorColor =
            floorBase +
            mix(gridColorB, gridColorA, clamp(grid, 0.0, 1.0))
            * grid * fade;

        float centerLane = exp(-abs(p.x) * 10.0) * 0.08;
        floorColor += vec3(0.0, 0.65, 1.0) * centerLane;

        color += floorColor;
    }

    float scan = 0.96 + 0.04 * sin(fragCoord.y * 1.3);
    color *= scan;

    float vignette = smoothstep(1.25, 0.15, length(p * vec2(0.9, 0.75)));
    color *= vignette;

    return vec4(color, 1.0);
}
`;

export { TronGridHorizonShader };
