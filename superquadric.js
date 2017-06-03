var superquadric = {
    N: null,
    M: null,
    n: 2,
    m: 2,
    verts: null,
    normals: null,
    texCoords: null,
    longitude : null,
    latitude : null,

    // FUNCTIONS FROM ASSIGNMENT ---------------------------------------------
    XUV : function (u,v,n,m){
    if(Math.abs(Math.cos(v)) < 0.00000001 || Math.abs(Math.cos(u)) < 0.00000001 ) return (0);
    else
        return  Math.cos(v) * Math.pow(Math.abs(Math.cos(v)),(2.0/m) - 1) * Math.cos(u) * Math.pow(Math.abs(Math.cos(u)),(2.0/n) - 1);
    },

    YUV : function (u,v,n,m){
    if(Math.abs(Math.cos(v)) < 0.00000001 || Math.abs(Math.sin(u)) < 0.00000001) return 0;
    else
        return  Math.cos(v) * Math.pow(Math.abs(Math.cos(v)),(2.0/m) - 1) * Math.sin(u) * Math.pow(Math.abs(Math.sin(u)),(2.0/n) - 1);
    },

    ZUV : function (v,m) {
    if(Math.abs(Math.sin(v)) < 0.00000001) return 0;
    else
        return Math.sin(v) * Math.pow(Math.abs(Math.sin(v)),(2.0/m) - 1);
    },

    NX : function (u,v,n,m){
    if(Math.abs(Math.cos(v)) < 0.00000001 || Math.abs(Math.cos(u)) < 0.00000001 ) return 0;
    else
        return  Math.cos(v) * Math.pow(Math.abs(Math.cos(v)),(1 - 2.0/m)) * Math.cos(u) * Math.pow(Math.abs(Math.cos(u)),(1 - 2.0/n));
    },

    NY : function (u,v,n,m){
    if(Math.abs(Math.cos(v)) < 0.00000001 || Math.abs(Math.sin(u)) < 0.00000001) return 0;
    else
        return  Math.cos(v) * Math.pow(Math.abs(Math.cos(v)),(1 - 2.0/m)) * Math.sin(u) * Math.pow(Math.abs(Math.sin(u)),(1 -  2/n));
    },

    NZ : function (v,m){
    if(Math.abs(Math.sin(v)) < 0.00000001) return 0;
    else
        return Math.sin(v) * Math.pow(Math.abs(Math.sin(v)), 1 - 2.0/m);
    },

    //----------------------------------------------------------------------------------
    createGeometry: function() {
        var N = this.N;
        var M = this.M;
        var n = this.n;
        var m = this.m;

        var numFloats = 3*(N+1)*(M+1);

        if (!this.verts || this.verts.length != numFloats || !this.texCoords || this.texCoords != 2 * numFloats) {
            this.verts = new Float32Array(numFloats);
            this.normals = new Float32Array(numFloats);
            this.texCoords = new Float32Array(2*(N+1)*(M+1));
        }
        this.longitude = new Float32Array(N + 1);
        this.latitude = new Float32Array(M + 1);

        for (var i = 0; i <= N; i++) {
            for (var j = 0; j <= M; j++) {
                // Get u and v for each sample
                var u = (2 * Math.PI / M) * j - Math.PI;
                var v = (Math.PI / N) * i - Math.PI / 2;

                this.verts[3 * (i * (M + 1) + j)] = this.XUV(u,v,n,m);
                this.verts[3 * (i * (M + 1) + j) + 1] = this.YUV(u,v,n,m);
                this.verts[3 * (i * (M + 1) + j) + 2] = this.ZUV(v,m);

                this.normals[3 * (i * (M + 1) + j)] = this.NX(u,v,n,m);
                this.normals[3 * (i * (M + 1) + j) + 1] = this.NY(u,v,n,m);
                this.normals[3 * (i * (M + 1) + j) + 2] = this.NZ(v,m);

                var x1;
                var x2;
                var y1;
                var y2;
                var z1;
                var z2;
                var d;
                if(i > 0){
                    x1 = this.verts[3 * ((i - 1) * (M + 1) + j)];
                    y1 = this.verts[3 * ((i - 1) * (M + 1) + j) + 1];
                    z1 = this.verts[3 * ((i - 1) * (M + 1) + j) + 2];
                    x2 = this.verts[3 * (i * (M + 1) + j)];
                    y2 = this.verts[3 * (i * (M + 1) + j) + 1];
                    z2 = this.verts[3 * (i * (M + 1) + j) + 2];
                    d = distance(x1, y1, z1, x2, y2, z2);
                    this.latitude[j] += d;
                }

                if(j > 0){
                    x1 = this.verts[3 * (i * (M + 1) + j - 1)];
                    y1 = this.verts[3 * (i * (M + 1) + j - 1) + 1];
                    z1 = this.verts[3 * (i * (M + 1) + j - 1) + 2];
                    x2 = this.verts[3 * (i * (M + 1) + j)];
                    y2 = this.verts[3 * (i * (M + 1) + j) + 1];
                    z2 = this.verts[3 * (i * (M + 1) + j) + 2];
                    d = distance(x1, y1, z1, x2, y2, z2);
                    this.longitude[i] += d;
                }
            }
        }
        for(var i = 0; i <= N ; i++){
            var d = 0;
            for(var j = 0; j <= M ; j++){
                if(j == 0) {
                    this.texCoords[2 * (i * (M + 1) + j)] = 0;
                }else{
                    x1 = this.verts[3 * (i * (M + 1) + j - 1)];
                    y1 = this.verts[3 * (i * (M + 1) + j - 1) + 1];
                    z1 = this.verts[3 * (i * (M + 1) + j - 1) + 2];
                    x2 = this.verts[3 * (i * (M + 1) + j)];
                    y2 = this.verts[3 * (i * (M + 1) + j) + 1];
                    z2 = this.verts[3 * (i * (M + 1) + j) + 2];
                    d += distance(x1, y1, z1, x2, y2, z2);
                    this.texCoords[2 * (i * (M + 1) + j)] = d/this.longitude[i];
                }
            }
        }

        for(var j = 0; j < M + 1; j++){
            var d = 0;
            for(var i = 0; i < N + 1; i++){
                if(i == 0){
                    this.texCoords[2*(i*(M+1)+j)+1] = this.texCoords[2*((M+1)+j)+1];
                }else if(j == M){
                    this.texCoords[2*(i*(M+1)+j)+1] = this.texCoords[2*(i*(M+1))+1];
                } else{
                    x1 = this.verts[3 * ((i - 1) * (M + 1) + j)];
                    y1 = this.verts[3 * ((i - 1) * (M + 1) + j) + 1];
                    z1 = this.verts[3 * ((i - 1) * (M + 1) + j) + 2];
                    x2 = this.verts[3 * (i * (M + 1) + j)];
                    y2 = this.verts[3 * (i * (M + 1) + j) + 1];
                    z2 = this.verts[3 * (i * (M + 1) + j) + 2];
                    d += distance(x1, y1, z1, x2, y2, z2);
                    this.texCoords[2 * (i * (M + 1) + j) + 1] = d/this.latitude[j];
                }
            }
        }
        for(var j = 0; j <= M; j++){
            this.texCoords[2 * j] = this.texCoords[2 * ((M + 1) + j)];
            this.texCoords[2 * (N * (M + 1) + j)] = this.texCoords[2 * ((N - 1) * (M + 1) + j)];
        }
    },

    triangleStrip: null,
    createTriangleStrip : function() {
        var M = this.M, N = this.N;
        var numIndices = N*(2*(M + 1) + 2) - 2;
        if (!this.triangleStrip || this.triangleStrip.length != numIndices)
            this.triangleStrip = new Uint16Array(numIndices);
        var index = function(i, j) {
            return i*(M+1) + j;
        }
        var n = 0;
        for (var i = 0; i < N; i++) {
            if (i > 0)
                this.triangleStrip[n++] = index(i,0);
            for (var j = 0; j <= M; j++) {
                this.triangleStrip[n++] = index(i+1,j);
                this.triangleStrip[n++] = index(i,j);
            }
            if (i < N-1)
                this.triangleStrip[n++] = index(i,M)
        }
    },

    createHedgeHog : function() {
        var hedgehog = [];
        var hedgeHogLength = 0.2;
        for (var i = 0; i < this.normals.length; i += 3) {
            var p = [this.verts[i], this.verts[i+1], this.verts[i+2]];
            var n = [this.normals[i], this.normals[i+1], this.normals[i+2]];
            var q = [p[0] + hedgeHogLength*n[0],
                p[1] + hedgeHogLength*n[1],
                p[2] + hedgeHogLength*n[2]];
            hedgehog.push(p[0], p[1], p[2],
                q[0], q[1], q[2]);
        }
        this.hedgeHog = new Float32Array(hedgehog);
    },

    createWireFrame : function() {
        var lines = [];
        lines.push(this.triangleStrip[0], this.triangleStrip[1]);
        var numStripIndices = this.triangleStrip.length;
        for (var i = 2; i < numStripIndices; i++) {
            var a = this.triangleStrip[i-2];
            var b = this.triangleStrip[i-1];
            var c = this.triangleStrip[i];
            if (a != b && b != c && c != a)
                lines.push(a, c, b, c);
        }
        this.wireframe = new Uint16Array(lines);
        var l = lines.length;
    }
};

function distance(x1, y1, z1, x2, y2, z2){
    var xSquare = (x2 - x1) * (x2 - x1);
    var ySquare = (y2 - y1) * (y2 - y1);
    var zSquare = (z2 - z1) * (z2 - z1);
    return Math.sqrt(xSquare + ySquare + zSquare);
}
