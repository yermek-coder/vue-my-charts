import * as d3 from "d3";

export function generateLinesData() {
    const lineColors = ["black", "black", "black"];
    const data = [];
    const numPoints = 10;

    // Generate first line
    const firstLine = {
        values: [],
        color: lineColors[0],
    };
    for (let i = 0; i < numPoints; i++) {
        firstLine.values.push({
            x: i,
            y: Math.random() * 10,
        });
    }
    data.push(firstLine);

    // Generate second and third lines
    let prevLine = firstLine;
    for (let i = 1; i < 3; i++) {
        const values = [];
        for (let j = 0; j < numPoints; j++) {
            const prevY = prevLine.values[j].y;
            values.push({
                x: j,
                y: prevY + Math.random() * (10 - prevY),
            });
        }
        data.push({
            values,
            color: lineColors[i],
        });
        prevLine = data[i];
    }

    // Generate point inside filled area
    const firstLineXValues = firstLine.values.map((d) => d.x);
    const lastLine = data[2];
    const lastLineXValues = lastLine.values.map((d) => d.x);
    const sharedXValues = firstLineXValues.filter((x) =>
        lastLineXValues.includes(x)
    );
    const sharedX =
        sharedXValues[Math.floor(Math.random() * sharedXValues.length)];
    const minY = Math.min(
        firstLine.values[sharedX].y,
        lastLine.values[sharedX].y
    );
    const maxY = Math.max(
        firstLine.values[sharedX].y,
        lastLine.values[sharedX].y
    );
    const point = {
        x: sharedX,
        y: minY + Math.random() * (maxY - minY),
    };

    return {
        data,
        point,
    };
}

export function generateWhiskerData() {
    const rand = d3.randomNormal();
    const titles = ["Title 1", "Title 2", "Title 3"];
    const data = d3.range(3).map(function (n) {
        return {
            title: titles[n],
            points: d3
                .range(30)
                .map((_) => parseInt(rand() * 100) / 100 + n * 0.1)
                .sort(d3.ascending),
            firmDot: n - Math.random(),
        };
    });
    return data;
}
