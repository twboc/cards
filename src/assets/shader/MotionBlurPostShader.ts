const MotionBlurPostShader = `
uniform shader iChannel0;
uniform float2 iResolution;

half4 main(vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;
    vec4 data = iChannel0.eval(uv * iResolution.xy);

    vec3 col = vec3(0.0);

    if (data.w < 0.0)
    {
        col = data.xyz;
    }
    else
    {
        // decompress velocity vector
        float ss = mod(data.w, 1024.0) / 1023.0;
        float st = floor(data.w / 1024.0) / 1023.0;

        // motion blur (linear blur across velocity vectors)
        vec2 dir = (-1.0 + 2.0 * vec2(ss, st)) * 0.25;

        for (int i = 0; i < 32; i++)
        {
            float h = float(i) / 31.0;
            vec2 pos = uv + dir * h;
            col += iChannel0.eval(pos * iResolution.xy).xyz;
        }

        col /= 32.0;
    }

    // vignetting
    col *= 0.5 + 0.5 * pow(16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), 0.1);

    col = clamp(col, 0.0, 1.0);
    col = col * 0.6 + 0.4 * col * col * (3.0 - 2.0 * col) + vec3(0.0, 0.0, 0.04);

    return vec4(col, 1.0);
}
`;

export { MotionBlurPostShader };
