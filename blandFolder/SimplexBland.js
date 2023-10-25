class SimplexBland {
    constructor() {
      this.N = 128;
      this.M = 64;
      this.A = new Array(this.N).fill().map(() => new Array(this.N).fill(0));
      this.B = new Array(this.N).fill().map(() => new Array(this.N).fill(0));
      this.C = new Array(this.N).fill(0);
      this.D = new Array(this.N).fill().map(() => new Array(this.N).fill(0));
      this.c = new Array(this.N).fill(0);
      this.b = new Array(this.N).fill(0);
      this.cb = new Array(this.N).fill(0);
      this.cbBI = new Array(this.N).fill(0);
      this.cbBID = new Array(this.M).fill(0);
      this.cd = new Array(this.M).fill(0);
      this.rd = new Array(this.M).fill(0);
      this.W = new Array(this.N).fill().map(() => new Array(this.N).fill(0));
      this.BI = new Array(this.M).fill().map(() => new Array(this.N).fill(0));
      this.BIA_aux = new Array(this.N)
        .fill()
        .map(() => new Array(this.N).fill(0));
      this.A_aux = new Array(this.N).fill().map(() => new Array(this.N).fill(0));
      this.BIb = new Array(this.N).fill(0);
      this.d = new Array(this.N).fill(0);
      this.basis = new Array(this.N).fill(0);
      this.n = 0;
      this.m = 0;
      this.epsilon = 0;
      this.Initial_n = 0;
      this.Initial_cb = new Array(this.N).fill(0);
      this.Initial_cd = new Array(this.N).fill(0);
      this.Initial_A = new Array(this.N)
        .fill()
        .map(() => new Array(this.N).fill(0));
      this.Initial_A_aux = new Array(this.N)
        .fill()
        .map(() => new Array(this.N).fill(0));
      this.Initial_c = new Array(this.N).fill(0);
      this.Initial_basis = new Array(this.N).fill(0);
      this.Initial_D = new Array(this.N)
        .fill()
        .map(() => new Array(this.N).fill(0));
      this.Initial_d = new Array(this.N).fill(0);
      this.Initial_B = new Array(this.N)
        .fill()
        .map(() => new Array(this.N).fill(0));
      this.Initial_BIb = new Array(this.N).fill(0);
      this.Initial_b = new Array(this.N).fill(0);
      this.Initial_b_aux = new Array(this.N).fill(0);
      this.Initial_rd = new Array(this.N).fill(0);
      this.Initial_BI = new Array(this.N)
        .fill()
        .map(() => new Array(this.N).fill(0));
      this.Initial_cbBI = new Array(this.N).fill(0);
      this.Initial_cbBID = new Array(this.N).fill(0);
      this.Initial_BIA_aux = new Array(this.N)
        .fill()
        .map(() => new Array(this.N).fill(0));
    }
  
    fabs(x) {
      return x < 0.0 ? -x : x;
    }
  
    swapRows(W, n, m1, m2) {
      let temp;
  
      for (let i = 0; i <= 2 * n; i++) {
        temp = W[m1][i];
        W[m1][i] = W[m2][i];
        W[m2][i] = temp;
      }
    }
  
    invGaussian(B, A, n) {
      let i, j;
  
      for (i = 0; i < n; ++i) {
        for (j = 0; j < n; ++j) {
          this.W[i][j] = A[i][j];
        }
      }
  
      for (i = 0; i < n; ++i) {
        for (j = n; j < 2 * n; ++j) {
          this.W[i][j] = 0.0;
        }
      }
  
      for (i = 0; i < n; ++i) {
        this.W[i][n + i] = 1.0;
      }
  
      console.log("\nBefore loop W: ");
  
      for (i = 0; i < n; ++i) {
        let rowStr = "";
        for (j = 0; j < 2 * n; ++j) {
          rowStr += ` ${this.W[i][j].toFixed(2)} `;
        }
        console.log(rowStr);
      }
  
      for (let k = 0; k < n; ++k) {
        console.log(`k = ${k}`);
        let p = k;
        let MaxValue = this.fabs(this.W[k][k]);
  
        for (i = k + 1; i < n; ++i) {
          if (this.fabs(this.W[i][k]) > MaxValue) {
            p = i;
            MaxValue = this.fabs(this.W[i][k]);
          }
        }
  
        console.log(`\np = ${p}, k = ${k}`);
        if (p !== k) {
          this.swapRows(this.W, n, k, p);
        }
  
        let RelativeValue = this.W[k][k];
        console.log(`RelativeValue = ${RelativeValue.toFixed(2)}`);
        this.W[k][k] = 1.0;
  
        let temp;
        for (j = k + 1; j < 2 * n; ++j) {
          temp = this.W[k][j] / RelativeValue;
          if (this.fabs(temp) < this.epsilon) {
            this.W[k][j] = 0.0;
          } else {
            this.W[k][j] = temp;
          }
        }
  
        for (i = 0; i < n; ++i) {
          if (i !== k) {
            RelativeValue = this.W[i][k];
            this.W[i][k] = 0.0;
  
            for (j = k + 1; j <= 2 * n; ++j) {
              temp = this.W[i][j] - RelativeValue * this.W[k][j];
              if (this.fabs(temp) < this.epsilon) {
                this.W[i][j] = 0.0;
              } else {
                this.W[i][j] = temp;
              }
            }
          }
        }
  
        console.log(" W: ");
  
        for (i = 0; i < n; ++i) {
          let rowStr = "";
          for (j = 0; j < 2 * n; ++j) {
            rowStr += ` ${this.W[i][j].toFixed(2)} `;
          }
          console.log(rowStr);
        }
      }
  
      for (i = 0; i < n; ++i) {
        for (j = 0; j < n; ++j) {
          B[j][i] = this.W[j][i + n];
        }
      }
  
      console.log("\nBI:\n");
  
      for (i = 0; i < n; ++i) {
        let rowStr = "";
        for (j = 0; j < n; ++j) {
          rowStr += ` ${B[i][j]} `;
        }
        console.log(rowStr);
      }
  
      console.log("\nW:\n");
  
      for (i = 0; i < n; ++i) {
        let rowStr = "";
        for (j = 0; j < 2 * n; ++j) {
          rowStr += ` ${this.W[i][j].toFixed(2)} `;
        }
        console.log(rowStr);
      }
    }
  
    simplexAlgorithm() {
      let count = 1;
      let optimal_flag = 0;
      console.log(this.m);
      console.log(this.n);
      console.log("basis");
  
      for (let i = 0; i < this.m; ++i) {
        console.log(this.basis[i]);
      }
  
      console.log();
      console.log("A:");
  
      for (let i = 0; i < this.m; ++i) {
        for (let j = 0; j < this.n; ++j) {
          console.log(this.A[i][j]);
          console.log();
        }
      }
  
      while (optimal_flag == 0) {
        console.log(count);
        count++;
        this.bubbleSort(this.basis, this.m);
        console.log("basis2:");
  
        for (let i = 0; i < this.m; ++i) {
          console.log(this.basis[i]);
          console.log();
        }
  
        this.setD();
        console.log("d:");
  
        for (let i = 0; i < this.n; ++i) {
          console.log(this.d[i]);
          console.log();
        }
  
        this.setAAux();
        console.log("A_aux(B,D):");
  
        for (let i = 0; i < this.m; ++i) {
          for (let j = 0; j < this.n; ++j) {
            console.log(this.A_aux[i][j]);
          }
  
          console.log();
        }
  
        this.copySubmatrix(this.B, this.A_aux, 0, this.m, 0, this.m);
        console.log("B:");
  
        for (let i = 0; i < this.m; ++i) {
          for (let j = 0; j < this.m; ++j) {
            console.log(this.B[i][j]);
          }
  
          console.log();
        }
  
        this.invGaussian(this.BI, this.B, this.m);
        this.eraseEpsilonsMatrix(this.BI, this.m, this.m);
        console.log("BI:");
  
        for (let i = 0; i < this.m; ++i) {
          for (let j = 0; j < this.m; ++j) {
            console.log(this.BI[i][j]);
          }
  
          console.log();
        }
  
        this.matrixMult(
          this.BIA_aux,
          this.BI,
          this.A_aux,
          this.m,
          this.m,
          this.n
        );
        this.eraseEpsilonsMatrix(this.BIA_aux, this.m, this.n);
        console.log("BIA_aux (I, B-1*D):");
  
        for (let i = 0; i < this.m; ++i) {
          for (let j = 0; j < this.n; ++j) {
            console.log(this.BIA_aux[i][j]);
          }
  
          console.log();
        }
  
        console.log("A_aux (B,D)");
  
        for (let i = 0; i < this.m; ++i) {
          for (let j = 0; j < this.n; ++j) {
            console.log(this.A_aux[i][j]);
          }
  
          console.log();
        }
  
        console.log("b:");
  
        for (let i = 0; i < this.m; ++i) {
          console.log(this.b[i]);
        }
  
        this.matrixVector(this.BIb, this.BI, this.b, this.m, this.m);
        this.eraseEpsilonsVector(this.BIb, this.m);
        console.log("BIb:");
  
        for (let i = 0; i < this.m; ++i) {
          console.log(this.BIb[i]);
        }
  
        console.log();
        this.copySubmatrix(
          this.D,
          this.A_aux,
          0,
          this.m,
          this.m,
          this.n - this.m
        );
        console.log("D:");
  
        for (let i = 0; i < this.m; ++i) {
          for (let j = 0; j < this.n - this.m; ++j) {
            console.log(this.D[i][j]);
          }
  
          console.log();
        }
  
        this.computeCbCd();
        console.log("cb:");
  
        for (let i = 0; i < this.m; ++i) {
          console.log(this.cb[i]);
        }
  
        console.log();
        console.log("cd");
  
        for (let i = 0; i < this.n - this.m; ++i) {
          console.log(this.cd[i]);
        }
  
        console.log();
        this.vectorMatrixMult(this.cbBI, this.cb, this.BI, this.m, this.m);
        this.eraseEpsilonsVector(this.cbBI, this.m);
        console.log("cbBI:");
  
        for (let i = 0; i < this.m; ++i) {
          console.log(this.cbBI[i]);
        }
  
        console.log();
        this.vectorMatrixMult(
          this.cbBID,
          this.cbBI,
          this.D,
          this.m,
          this.n - this.m
        );
        this.eraseEpsilonsVector(this.cbBID, this.n - this.m);
        console.log("cbBID");
  
        for (let i = 0; i < this.n - this.m; ++i) {
          console.log(this.cbBID[i]);
        }
  
        console.log();
        this.vectorSubtract(this.rd, this.cd, this.cbBID, this.n - this.m);
        this.eraseEpsilonsVector(this.rd, this.n - this.m);
        console.log("rd( cd - cbBID ):");
  
        for (let i = 0; i < this.n - this.m; ++i) {
          console.log(this.rd[i]);
        }
  
        console.log();
        let min_value = this.findMinValue(this.rd, this.n - this.m);
        if (min_value >= 0.0) {
          optimal_flag = true;
        } else {
          let enter_id = this.findFirstNegative();
          let exiting_id = this.findFirstExitingId(
            this.BIA_aux,
            this.BIb,
            enter_id,
            this.n,
            this.m
          );
          console.log("enter_id" + enter_id);
          console.log("exiting_id" + exiting_id);
          console.log("d[exiting]" + this.d[exiting_id]);
          console.log("pivot: enter_id" + enter_id);
          console.log("exiting_id" + this.d[exiting_id]);
          this.basis[exiting_id] = enter_id;
          console.log("basis3:");
  
          for (let i = 0; i < this.m; ++i) {
            console.log(this.basis[i]);
          }
  
          console.log();
        }
      }
    }
  
    findFirstNegative() {
      let first_index = this.n + 1;
      let found = 0;
  
      for (let i = 0; i < this.n - this.m && found == 0; ++i) {
        if (this.rd[i] < 0.0) {
          if (first_index > this.d[this.m + i]) {
            first_index = this.d[this.m + i];
          }
        } else {
          console.log("first_index " + first_index);
        }
      }
  
      return first_index;
    }
  
    findFirstExitingId(y, x, enter_id, n, m) {
      let temp_min_index = 0;
      let init_flag = 0;
      let unbounded_flag = 1;
      let temp_min = 0.0;
      let temp = 0.0;
  
      let q = 0;
      for (let i = 0; i < n; ++i) {
        if (this.d[i] === enter_id) {
          q = i;
        }
      }
  
      for (let i = 0; i < m; ++i) {
        console.log(i);
        console.log(q);
        console.log(y[i][q]);
        console.log(i);
        console.log(x[i]);
        console.log("init_flag " + init_flag);
  
        if (y[i][q] > 0.0) {
          unbounded_flag = 0;
          temp = x[i] / y[i][q];
          console.log(i);
          console.log(temp);
  
          if (init_flag === 0) {
            temp_min = temp;
            temp_min_index = i;
            init_flag = 1;
          } else if (temp < temp_min) {
            temp_min = temp;
            temp_min_index = i;
          } else if (temp === temp_min && this.d[i] < this.d[temp_min_index]) {
            temp_min = temp;
            temp_min_index = i;
          }
  
          console.log("2 :n" + i);
        }
      }
  
      console.log("unbounded flag =" + unbounded_flag);
  
      if (unbounded_flag === 1) {
        console.log("Unbounded linear program!");
        // Handle unbounded case here
      }
  
      console.log("temp_min_index " + temp_min_index);
      console.log("temp_min " + temp_min);
      return temp_min_index;
    }
  
    bubbleSort(array, n) {
      let flag = 1;
  
      for (let i = 0; i < n && flag == 1; ++i) {
        flag = 0;
        let limit = n - i - 1;
  
        for (let j = 0; j < limit; ++j) {
          if (array[j] > array[j + 1]) {
            flag = true;
            let temp = array[j];
            array[j] = array[j + 1];
            array[j + 1] = temp;
          }
        }
      }
    }
  
    setD() {
      for (let i = 0; i < this.m; ++i) {
        this.d[i] = this.basis[i];
      }
  
      let pos = this.m;
  
      for (let i = 0; i < this.n; ++i) {
        let flag = 1;
  
        for (let j = 0; j < this.m && flag; ++j) {
          if (i === this.basis[j]) {
            flag = 0;
          }
        }
  
        if (flag) {
          this.d[pos++] = i;
        }
      }
    }
  
    setAAux() {
      for (let i = 0; i < this.n; ++i) {
        let k = this.d[i];
  
        for (let j = 0; j < this.m; ++j) {
          this.A_aux[j][i] = this.A[j][k];
        }
      }
    }
  
    copySubmatrix(Dest, Source, istart, depth, jstart, length) {
      for (let i = istart; i < depth; ++i) {
        for (let j = jstart; j < jstart + length; ++j) {
          Dest[i - istart][j - jstart] = Source[i][j];
        }
      }
    }
  
    computeCbCd() {
      for (let i = 0; i < this.m; ++i) {
        this.cb[i] = this.c[this.d[i]];
      }
  
      for (let i = this.m; i < this.n; ++i) {
        this.cd[i - this.m] = this.c[this.d[i]];
      }
  
      console.log("d:");
  
      for (let i = 0; i < this.n; ++i) {
        console.log(this.d[i]);
      }
  
      console.log();
      console.log("cb:");
  
      for (let i = 0; i < this.m; ++i) {
        console.log(this.cb[i]);
      }
  
      console.log();
      console.log("cd:");
  
      for (let i = 0; i < this.n; ++i) {
        console.log(this.cd[i]);
      }
  
      console.log();
    }
  
    eraseEpsilonsMatrix(dmat, m, n) {
      for (let i = 0; i < m; ++i) {
        for (let j = 0; j < n; ++j) {
          if (Math.abs(dmat[i][j]) < this.epsilon) {
            dmat[i][j] = 0.0;
          }
        }
      }
    }
  
    matrixMult(C, A, B, n, m, p) {
      for (let i = 0; i < n; ++i) {
        for (let j = 0; j < p; ++j) {
          let sum = 0.0;
  
          for (let k = 0; k < m; ++k) {
            sum += A[i][k] * B[k][j];
          }
  
          C[i][j] = sum;
        }
      }
    }
  
    matrixVector(c, A, b, n, m) {
      for (let i = 0; i < n; ++i) {
        let sum = 0.0;
  
        for (let k = 0; k < m; ++k) {
          sum += A[i][k] * b[k];
        }
  
        c[i] = sum;
      }
    }
  
    eraseEpsilonsVector(darray, n) {
      for (let i = 0; i < n; ++i) {
        if (Math.abs(darray[i]) < this.epsilon) {
          darray[i] = 0.0;
        }
      }
    }
  
    vectorMatrixMult(c, b, A, n, m) {
      for (let i = 0; i < m; ++i) {
        let sum = 0.0;
  
        for (let k = 0; k < n; ++k) {
          sum += A[k][i] * b[k];
        }
  
        c[i] = sum;
      }
    }
  
    vectorSubtract(result_v, v1, v2, n) {
      for (let i = 0; i < n; ++i) {
        result_v[i] = v1[i] - v2[i];
      }
    }
  
    findMinValue(rd, n) {
      let most_index = this.d[0];
      let temp_value = rd[0];
  
      for (let i = 0; i < n; ++i) {
        if (rd[i] < temp_value) {
          most_index = this.d[i];
          temp_value = rd[i];
        }
      }
  
      return temp_value;
    }
  }
  
  export default SimplexBland;  