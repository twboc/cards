const LogoWaveShaderCentered = `
uniform float2 iResolution;
uniform float iTime;

float wave_phase() {
    return iTime;
}

float square(vec2 st) {
    vec2 bl = step(vec2(0.0), st);
    vec2 tr = step(vec2(0.0), 1.0 - st);
    return bl.x * bl.y * tr.x * tr.y;
}

half4 frameShape(vec2 st) {
    float tushka = square(vec2(
        st.x / 0.48,
        st.y / 0.69
    ));

    float s0 = square(vec2(
        st.x / 0.16 + (1.0 / 0.16) * 0.000,
        st.y / 0.22 + (1.0 / 0.16) * -0.280
    ));

    float s1 = square(vec2(
        st.x / 0.16 + (1.0 / 0.16) * 0.000,
        st.y / 0.22 + (1.0 / 0.16) * -0.060
    ));

    float s2 = square(vec2(
        st.x / 0.16 + (1.0 / 0.16) * -0.240,
        st.y / 0.22 + (1.0 / 0.16) * -0.280
    ));

    float s3 = square(vec2(
        st.x / 0.16 + (1.0 / 0.16) * -0.240,
        st.y / 0.22 + (1.0 / 0.16) * -0.060
    ));

    vec3 c0 = vec3(0.941, 0.439, 0.404) * s0;
    vec3 c1 = vec3(0.435, 0.682, 0.843) * s1;
    vec3 c2 = vec3(0.659, 0.808, 0.506) * s2;
    vec3 c3 = vec3(0.996, 0.859, 0.114) * s3;

    return vec4(c0 + c1 + c2 + c3, tushka);
}

half4 trail_piece(vec2 st, vec2 index) {
    float scale = index.x * 0.082 + 0.452;
    vec3 color = vec3(0.0);

    if (index.y > 0.9 && index.y < 2.1) {
        color = vec3(0.435, 0.682, 0.843);
        scale *= 0.8;
    } else if (index.y > 3.9 && index.y < 5.1) {
        color = vec3(0.941, 0.439, 0.404);
        scale *= 0.8;
    }

    float scale1 = 1.0 / scale;
    float shift = -(1.0 - scale) / (2.0 * scale);

    vec2 st2 = vec2(
        st.x * scale1 + shift,
        st.y * scale1 + shift
    );

    float mask = square(st2);
    return vec4(color, mask);
}

half4 trail(vec2 st) {
    float pieceHeight = 7.0 / 0.69;
    float pieceWidth = 6.0 / 0.54;
    float pi = 3.14159265358979323846;
    float period = 2.0 * pi;
    float waveAmplitude = 0.076;

    st.x = 1.2760 * pow(st.x, 3.0) - 1.4624 * st.x * st.x + 1.4154 * st.x;

    float xAtCell = floor(st.x * pieceWidth) / pieceWidth;
    float xAtCellCenter = xAtCell + 0.016;
    float incline = cos(0.5 * period + wave_phase()) * waveAmplitude;

    float offset =
        sin(xAtCellCenter * period + wave_phase()) * waveAmplitude +
        incline * (st.x - xAtCell) * 5.452;

    float mask =
        step(offset, st.y) *
        (1.0 - step(0.69 + offset, st.y)) *
        step(0.0, st.x);

    vec2 cellCoord = vec2(
        (st.x - xAtCell) * pieceWidth,
        fract((st.y - offset) * pieceHeight)
    );

    vec2 cellIndex = vec2(
        xAtCell * pieceWidth,
        floor((st.y - offset) * pieceHeight)
    );

    vec4 pieces = trail_piece(cellCoord, cellIndex);
    return vec4(pieces.rgb, pieces.a * mask);
}

half4 logo(vec2 st) {
    float pi = 3.14159265358979323846;
    float period = 2.0 * pi;
    float waveAmplitude = 0.076;

    if (st.x <= 0.54) {
        return trail(st);
    } else {
        vec2 st2 = st + vec2(0.0, -sin(st.x * period + wave_phase()) * waveAmplitude);
        return frameShape(st2 + vec2(-0.54, 0.0));
    }
}

half4 main(vec2 fragCoord) {
    float pi = 3.14159265358979323846;
    float rot = pi * -0.124;

    // Parent canvas aspect
    float aspect = iResolution.x / iResolution.y;
    float minDim = min(iResolution.x, iResolution.y);

    // Centered viewport coordinates:
    // y range ~ [-1,1], x range ~ [-aspect,aspect]
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) * 2.0 / minDim;

    // Logo's unrotated logical size
    float logoW = 1.02;               // 0.54 trail + 0.48 frame
    float logoH = 0.69 + 0.076 * 2.0; // include wave motion padding

    // Rotated bounding box size
    float cabs = abs(cos(rot));
    float sabs = abs(sin(rot));
    float bboxW = cabs * logoW + sabs * logoH;
    float bboxH = sabs * logoW + cabs * logoH;

    // Fit the rotated logo into the canvas with a little padding
    float fitScale = 0.9 * min((2.0 * aspect) / bboxW, 2.0 / bboxH);

    // Convert screen coords -> logo local coords
    // divide by fitScale so the logo scales with parent size
    vec2 p = uv / fitScale;

    // rotate around center
    float c = cos(-rot);
    float s = sin(-rot);
    p = vec2(
        c * p.x - s * p.y,
        s * p.x + c * p.y
    );

    // move centered local coords into logo-space [0..logoW] x [0..logoH]
    p += vec2(logoW * 0.5, 0.69 * 0.5);

    vec4 logoCol = logo(p);
    vec4 bg = vec4(0.0, 0.5, 0.5, 1.0);

    return mix(bg, logoCol, logoCol.a);
}
`;

export { LogoWaveShaderCentered };
