export class SimplexBest {
    constructor() {
      this.N = 128;
      this.M = 64;
      this.A = new Array(this.N).fill(null).map(() => new Array(this.N).fill(0));
      this.B = new Array(this.N).fill(null).map(() => new Array(this.N).fill(0));
      this.C = new Array(this.N).fill(0);
      this.D = new Array(this.N).fill(null).map(() => new Array(this.N).fill(0));
      this.c = new Array(this.N).fill(0);
      this.b = new Array(this.N).fill(0);
      this.bAux = new Array(this.N).fill(0);
      this.cb = new Array(this.N).fill(0);
      this.cbBI = new Array(this.N).fill(0);
      this.cbBID = new Array(this.M).fill(0);
      this.cd = new Array(this.M).fill(0);
      this.rd = new Array(this.M).fill(0);
      this.BID = new Array(this.M).fill(0);
      this.W = new Array(this.N).fill(null).map(() => new Array(this.N).fill(0));
      this.BI = new Array(this.M).fill(null).map(() => new Array(this.N).fill(0));
      this.BIA_aux = new Array(this.N)
        .fill(null)
        .map(() => new Array(this.N).fill(0));
  
      this.A_aux = new Array(this.N)
        .fill(null)
        .map(() => new Array(this.N).fill(0));
      this.BIb = new Array(this.N).fill(0);
  
      this.d = new Array(this.N).fill(0);
      this.d_aux = new Array(this.N).fill(0);
      this.basis = new Array(this.N).fill(0);
      this.n = 0;
      this.m = 0;
  
      this.epsilon = 0;
  
      this.Initial_n = 0;
      this.Initial_W = new Array(this.N)
        .fill(null)
        .map(() => new Array(this.N).fill(0));
      this.Initial_cb = new Array(this.N).fill(0);
      this.Initial_cd = new Array(this.N).fill(0);
      this.Initial_A = new Array(this.N)
        .fill(null)
        .map(() => new Array(this.N).fill(0));
      this.Initial_A_aux = new Array(this.N)
        .fill(null)
        .map(() => new Array(this.N).fill(0));
      this.Initial_c = new Array(this.N).fill(0);
      this.Initial_basis = new Array(this.N).fill(0);
      this.Initial_D = new Array(this.N)
        .fill(null)
        .map(() => new Array(this.N).fill(0));
      this.Initial_d = new Array(this.N).fill(0);
      this.Initial_B = new Array(this.N)
        .fill(null)
        .map(() => new Array(this.N).fill(0));
      this.Initial_BIb = new Array(this.N).fill(0);
  
      this.Initial_b = new Array(this.N).fill(0);
      this.Initial_b_aux = new Array(this.N).fill(0);
      this.Initial_rd = new Array(this.N).fill(0);
      this.Initial_BID = new Array(this.N)
        .fill(null)
        .map(() => new Array(this.N).fill(0));
      this.Initial_BI = new Array(this.N)
        .fill(null)
        .map(() => new Array(this.N).fill(0));
      this.Initial_cbBI = new Array(this.N).fill(0);
      this.Initial_cbBID = new Array(this.N).fill(0);
      this.Initial_BIA_aux = new Array(this.N)
        .fill(null)
        .map(() => new Array(this.N).fill(0));
    }
  
    fabs(x) {
      return x < 0 ? -x : x;
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
      let i, j, k, p, itemp;
      let MaxValue, RelativeValue;
      let temp;
  
      for (i = 0; i < n; i++) for (j = 0; j < n; j++) this.W[i][j] = A[i][j];
  
      for (i = 0; i < n; i++) for (j = n; j < 2 * n; j++) this.W[i][j] = 0.0;
  
      for (i = 0; i < n; i++) this.W[i][n + i] = 1.0;
  
  
      for (k = 0; k < n; k++) {
        p = k;
        MaxValue = this.fabs(this.W[k][k]);
        for (i = k + 1; i < n; i++)
          if (this.fabs(this.W[i][k]) > MaxValue) {
            p = i;
            MaxValue = this.fabs(this.W[i][k]);
          }
  
  
        if (p !== k) {
          this.swapRows(this.W, n, k, p);
        }
        RelativeValue = this.W[k][k];
        this.W[k][k] = 1.0;
  
        for (j = k + 1; j < 2 * n; j++) {
          temp = this.W[k][j] / RelativeValue;
          if (this.fabs(temp) < this.epsilon) this.W[k][j] = 0.0;
          else this.W[k][j] = temp;
        }
  
        for (i = 0; i < n; i++) {
          if (i !== k) {
            RelativeValue = this.W[i][k];
            this.W[i][k] = 0.0;
            for (j = k + 1; j <= 2 * n; j++) {
              temp = this.W[i][j] - RelativeValue * this.W[k][j];
              if (this.fabs(temp) < this.epsilon) this.W[i][j] = 0.0;
              else this.W[i][j] = temp;
            }
          }
        }
  
      }
  
      for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) B[j][i] = this.W[j][i + n];
      }
  
    }
  
    simplexAlgorithm() {
      let i, j, k, optimal_flag, enter_id, exiting_id, itemp, basis_i;
      let dtemp, min_value;
  
      let count = 0;
      optimal_flag = 0;
  
      while (optimal_flag === 0) {
        count++;
  
        this.bubbleSort(this.basis, this.m);
  
  
        this.setD();
  
  
        this.setAAux();
  
  
        this.copySubmatrix(this.B, this.A_aux, 0, this.m, 0, this.m);
  
  
        this.invGaussian(this.BI, this.B, this.m);
  
        this.eraseEpsilonsMatrix(this.BI, this.m, this.m);

  
  
        this.matrixMult(
          this.BIA_aux,
          this.BI,
          this.A_aux,
          this.m,
          this.m,
          this.n
        );
  
        this.eraseEpsilonsMatrix(this.BIA_aux, this.m, this.n);
  
        this.matrixVector(this.BIb, this.BI, this.b, this.m, this.m);
        this.eraseEpsilonsVector(this.BIb, this.m);
  
        this.copySubmatrix(
          this.D,
          this.A_aux,
          0,
          this.m,
          this.m,
          this.n - this.m
        );
  
        // END OF FOR
  
        this.computeCbCd();
  
        this.vectorMatrixMult(this.cbBI, this.cb, this.BI, this.m, this.m);
        this.eraseEpsilonsVector(this.cbBI, this.m);
  
        this.vectorMatrixMult(
          this.cbBID,
          this.cbBI,
          this.D,
          this.m,
          this.n - this.m
        );
        this.eraseEpsilonsVector(this.cbBID, this.n - this.m);
  
  
        this.vectorSubtract(this.rd, this.cd, this.cbBID, this.n - this.m);
        this.eraseEpsilonsVector(this.rd, this.n - this.m);
  
 
  
        min_value = this.findMinValue(this.rd, this.n - this.m);
        if (min_value >= 0.0) {
          optimal_flag = 1;
        } else {
          let negative_rds = [];
          let index,
            n_n_rds = 0,
            best_improvement_id = 0,
            best_exiting_id,
            q = 0;
          let best_improvement,
            temp_improvement = 0.0;
  
          n_n_rds = this.findAllNegativeRds(negative_rds);
          best_improvement = 0.0;
          best_exiting_id = -1;
          for (index = 0; index < n_n_rds; index++) {
            enter_id = negative_rds[index];
            for (k = 0; k < this.n - this.m; k++) {
              if (this.d[this.m + k] === enter_id) {
                q = k;
              }
            }
            exiting_id = this.findExitingId(
              this.BIA_aux,
              this.BIb,
              enter_id,
              this.n,
              this.m,
              temp_improvement
            );

            if(exiting_id === "NONE"){
              const finalSoultionParagraph = document.querySelector('.final-solution-output');
              finalSoultionParagraph.innerHTML = "Unbounded linear program!";
              return "NONE";
            }
  
            if (temp_improvement >= best_improvement) {
              best_improvement = temp_improvement;
              best_improvement_id = enter_id;
              best_exiting_id = exiting_id;
            }
          }
  
          enter_id = best_improvement_id;
          exiting_id = best_exiting_id;
  
          this.basis[exiting_id] = enter_id;

        }
      }
    }
  
    findAllNegativeRds(neg_ids) {
      let i, index, most_index;
      let temp_value;
  
      index = 0;
      for (i = 0; i < this.n - this.m; i++) {
        if (this.rd[i] < 0) {
          neg_ids[index] = this.d[this.m + i];
          index++;
        }
      }
  
      return index;
    }
  
    findExitingId(y, x, enter_id, n, m) {
      let i = 0;
      let j = 0;
      let temp_min_index = 0;
      let init_flag = 0;
      let q = 0;
      let unbounded_flag = 0;
      let temp_min = 0.0;
      let temp = 0.0;
  
      for (i = 0; i < n; i++) {
        if (this.d[i] === enter_id) {
          q = i;
        }
      }
  
      init_flag = 0;
  
      unbounded_flag = 1;
  
      for (i = 0; i < m; i++) {
        if (y[i][q] > 0.0) {
          unbounded_flag = 0;
          temp = x[i] / y[i][q];
          if (init_flag === 0) {
            temp_min = temp;
            temp_min_index = i;
            init_flag = 1;
          } else if (temp < temp_min) {
            temp_min = temp;
            temp_min_index = i;
          }
        }
      }
  
      if (unbounded_flag === 1) {
        console.log("Unbounded linear program!");
        return "NONE";
      }
  
      return temp_min_index;
    }
    bubbleSort(array, n) {
      let i, j, limit, flag, temp;
  
      flag = 1;
      for (i = 0; i < n && flag === 1; i++) {
        flag = 0;
        limit = n - i - 1;
        for (j = 0; j < limit; j++) {
          if (array[j] > array[j + 1]) {
            flag = 1;
            temp = array[j];
            array[j] = array[j + 1];
            array[j + 1] = temp;
          }
        }
      }
    }
  
    setD() {
      let i, j, pos, flag;
  
      for (i = 0; i < this.m; i++) {
        this.d[i] = this.basis[i];
      }
  
      pos = this.m;
      for (i = 0; i < this.n; i++) {
        flag = 1;
        for (j = 0; j < this.m && flag === 1; j++) {
          if (i === this.basis[j]) {
            flag = 0;
          }
        }
        if (flag === 1) {
          this.d[pos++] = i;
        }
      }
    }
  
    setAAux() {
      let i, j, k;
  
      for (i = 0; i < this.n; i++) {
        k = this.d[i];
        for (j = 0; j < this.m; j++) {
          this.A_aux[j][i] = this.A[j][k];
        }
      }
    }
  
    copySubmatrix(Dest, Source, istart, depth, jstart, length) {
      for (let i = istart; i < istart + depth; i++) {
        for (let j = jstart; j < jstart + length; j++) {
          Dest[i - istart][j - jstart] = Source[i][j];
        }
      }
    }
  
    computeCbCd() {
      for (let i = 0; i < this.m; i++) {
        this.cb[i] = this.c[this.d[i]];
      }
  
      for (let i = this.m; i < this.n; i++) {
        this.cd[i - this.m] = this.c[this.d[i]];
      }
    }
  
    eraseEpsilonsMatrix(dmat, m, n) {
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          if (Math.abs(dmat[i][j]) < this.epsilon) {
            dmat[i][j] = 0.0;
          }
        }
      }
    }
  
    matrixMult(C, A, B, n, m, p) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < p; j++) {
          let sum = 0.0;
          for (let k = 0; k < m; k++) {
            sum += A[i][k] * B[k][j];
          }
          C[i][j] = sum;
        }
      }
    }
  
    matrixVector(c, A, b, n, m) {
      for (let i = 0; i < n; i++) {
        let sum = 0.0;
        for (let k = 0; k < m; k++) {
          sum += A[i][k] * b[k];
        }
        c[i] = sum;
      }
    }
  
    eraseEpsilonsVector(darray, n) {
      for (let i = 0; i < n; i++) {
        if (Math.abs(darray[i]) < this.epsilon) {
          darray[i] = 0.0;
        }
      }
    }
  
    vectorMatrixMult(c, b, A, n, m) {
      for (let i = 0; i < m; i++) {
        let sum = 0.0;
        for (let k = 0; k < n; k++) {
          sum += A[k][i] * b[k];
        }
        c[i] = sum;
      }
    }
  
    vectorSubtract(result_v, v1, v2, n) {
      for (let i = 0; i < n; i++) {
        result_v[i] = v1[i] - v2[i];
      }
    }
    findMinValue(rd, n) {
      let temp_value = rd[0];
      let most_index = this.d[0];
  
      for (let i = 0; i < n; i++) {
        if (rd[i] < temp_value) {
          most_index = this.d[i];
          temp_value = rd[i];
        }
      }
  
      return temp_value;
    }
}
