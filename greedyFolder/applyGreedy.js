import SimplexGreedy from "./SimplexGreedy.js";
const simplexGreedy = new SimplexGreedy();
//const filePath = "simplexGreedy/simplex.txt";
//import fs from "fs";

export class GreedyMain {
  enter(fileInputElement) {
    try {
      //const data = fs.readFileSync(filePath, "utf8").split("\n");
      const reader = new FileReader();
      let data = null;
      reader.onload = (e)=>{
        data = e.target.result;
        data = data.split("\n");
        let indexI, indexJ, itemp, n_p_m;

        let str = data.shift().trim();
        console.log(`str = ${str}`);

        str = data.shift().trim();
        const parts = str.split(" ");

        simplexGreedy.m = parseInt(parts[0], 10);
        simplexGreedy.n = parseInt(parts[1], 10);
        console.log(`n = ${simplexGreedy.n}, m = ${simplexGreedy.m}`);

        simplexGreedy.Initial_n = simplexGreedy.n + simplexGreedy.m;

        n_p_m = simplexGreedy.n + simplexGreedy.m;

        this.readFile(data);

        console.log(`\nepsilon = ${simplexGreedy.epsilon}`);

        console.log(" A: ");
        this.printOriginalSystem(
            simplexGreedy.A,
            simplexGreedy.n,
            simplexGreedy.m
        );

        this.copyToInitialMatrix();

        console.log("Initial_A:");
        for (indexI = 0; indexI < simplexGreedy.m; indexI++) {
            let row = "";
            for (indexJ = 0; indexJ < n_p_m; indexJ++)
            row += ` ${simplexGreedy.Initial_A[indexI][indexJ].toFixed(2)} `;
            console.log(row);
        }

        for (indexI = 0; indexI < simplexGreedy.m; indexI++)
            simplexGreedy.Initial_basis[indexI] = indexI + simplexGreedy.n;
        for (indexI = 0; indexI < simplexGreedy.n; indexI++)
            simplexGreedy.Initial_c[indexI] = 0.0;
        for (indexI = simplexGreedy.n; indexI < simplexGreedy.Initial_n; indexI++)
            simplexGreedy.Initial_c[indexI] = 1.0;
        for (indexI = 0; indexI < simplexGreedy.m; indexI++)
            simplexGreedy.Initial_b[indexI] = simplexGreedy.b[indexI];
        for (indexI = 0; indexI < simplexGreedy.m; indexI++)
            simplexGreedy.Initial_b_aux[indexI] = simplexGreedy.b[indexI];

        console.log("\nInitial_basis:");
        console.log(simplexGreedy.Initial_basis.join(" "));

        console.log("\nInitial_c:");
        console.log(
            simplexGreedy.Initial_c.map((val) => val.toFixed(2)).join(" ")
        );

        console.log("\nInitial_b:");
        console.log(
            simplexGreedy.Initial_b.map((val) => val.toFixed(2)).join(" ")
        );

        this.initialSimplexAlgorithm();

        for (indexI = 0; indexI < simplexGreedy.m; indexI++) {
            itemp = simplexGreedy.Initial_basis[indexI];
            simplexGreedy.basis[indexI] = itemp;
            if (itemp >= simplexGreedy.n) {
                const finalSoultionParagraph = document.querySelector('.final-solution-output');
                finalSoultionParagraph.innerHTML = this.printNoSolution();
                return;
            }
        }

        this.printInitialSolution();

        const result = simplexGreedy.simplexAlgorithm();
        const finalSoultionParagraph = document.querySelector('.final-solution-output');

        if(result === "Unbounded linear program!"){
          finalSoultionParagraph.innerHTML = result;
          return 0;
        }

        this.bublesortD(simplexGreedy.basis, simplexGreedy.BIb, simplexGreedy.m);

        finalSoultionParagraph.innerHTML = this.printSolution().replace(/\n/g, '<br>');
      };
      reader.readAsText(fileInputElement.files[0]);
      
    } catch (error) {
      console.error(error.message);
      return;
    }
  }

  copyToInitialMatrix() {
    for (let i = 0; i < simplexGreedy.m; ++i) {
      for (let j = 0; j < simplexGreedy.n; ++j) {
        simplexGreedy.Initial_A[i][j] = simplexGreedy.Initial_A_aux[i][j] =
          simplexGreedy.A[i][j];
      }
    }

    for (let i = 0; i < simplexGreedy.m; ++i) {
      for (
        let j = simplexGreedy.n;
        j < simplexGreedy.n + simplexGreedy.m;
        ++j
      ) {
        if (i === j - simplexGreedy.n) {
          simplexGreedy.Initial_A[i][j] = simplexGreedy.Initial_A_aux[i][
            j
          ] = 1.0;
        } else {
          simplexGreedy.Initial_A[i][j] = simplexGreedy.Initial_A_aux[i][
            j
          ] = 0.0;
        }
      }
    }
  }
  printOriginalSystem(A, n, m) {
    console.log("Original System:");

    for (let i = 0; i < m; ++i) {
      let row = "";
      for (let j = 0; j < n; ++j) {
        row += A[i][j].toFixed(3).padStart(10, " ");
      }
      console.log(row);
    }
  }

  bublesortD(array, darr, n) {
    let flag = 1;

    for (let i = 0; i < n && flag; ++i) {
      flag = 0;
      const limit = n - i - 1;

      for (let j = 0; j < limit; ++j) {
        if (array[j] > array[j + 1]) {
          flag = 1;

          // Swap double values
          const dtemp = darr[j];
          darr[j] = darr[j + 1];
          darr[j + 1] = dtemp;

          // Swap integer values
          const temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
  }

  initialSimplexAlgorithm() {
    let optimalFlag = 0;
    console.log(
      `m = ${simplexGreedy.m}, Initial_n = ${simplexGreedy.Initial_n}`
    );
    console.log("\nInitial_basis:\n");
    console.log(simplexGreedy.Initial_basis.join(" "));

    console.log("\nInitial_A:\n");
    for (let i = 0; i < simplexGreedy.m; ++i) {
      let row = "";
      for (let j = 0; j < simplexGreedy.Initial_n; ++j) {
        row += ` ${simplexGreedy.Initial_A[i][j].toFixed(2)} `;
      }
      console.log(row);
    }

    while (optimalFlag == 0) {
      simplexGreedy.bubbleSort(simplexGreedy.Initial_basis, simplexGreedy.m);
      console.log("\nInitial_basis:\n");
      console.log(simplexGreedy.Initial_basis.join(" "));

      this.initialSetD();
      console.log("\nInitial_d:\n");
      console.log(simplexGreedy.Initial_d.join(" "));

      this.setInitialAAux();
      console.log("\nInitial_A_aux (B, D):\n");
      for (let i = 0; i < simplexGreedy.m; ++i) {
        let row = "";
        for (let j = 0; j < simplexGreedy.Initial_n; ++j) {
          row += ` ${simplexGreedy.Initial_A_aux[i][j].toFixed(2)} `;
        }
        console.log(row);
      }

      simplexGreedy.copySubmatrix(
        simplexGreedy.Initial_B,
        simplexGreedy.Initial_A_aux,
        0,
        simplexGreedy.m,
        0,
        simplexGreedy.m
      );
      console.log("\nInitial_B:\n");
      for (let i = 0; i < simplexGreedy.m; ++i) {
        let row = "";
        for (let j = 0; j < simplexGreedy.m; ++j) {
          row += ` ${simplexGreedy.Initial_B[i][j].toFixed(2)} `;
        }
        console.log(row);
      }

      simplexGreedy.invGaussian(
        simplexGreedy.Initial_BI,
        simplexGreedy.Initial_B,
        simplexGreedy.m
      );
      simplexGreedy.eraseEpsilonsMatrix(
        simplexGreedy.Initial_BI,
        simplexGreedy.m,
        simplexGreedy.m
      );
      console.log("\nInitial_BI:\n");
      for (let i = 0; i < simplexGreedy.m; ++i) {
        let row = "";
        for (let j = 0; j < simplexGreedy.m; ++j) {
          row += ` ${simplexGreedy.Initial_BI[i][j].toFixed(2)} `;
        }
        console.log(row);
      }

      simplexGreedy.matrixMult(
        simplexGreedy.Initial_BIA_aux,
        simplexGreedy.Initial_BI,
        simplexGreedy.Initial_A_aux,
        simplexGreedy.m,
        simplexGreedy.m,
        simplexGreedy.Initial_n
      );
      simplexGreedy.eraseEpsilonsMatrix(
        simplexGreedy.Initial_BIA_aux,
        simplexGreedy.m,
        simplexGreedy.Initial_n
      );
      console.log("\nInitial_BIA_aux (I, B-1*D):\n");
      for (let i = 0; i < simplexGreedy.m; ++i) {
        let row = "";
        for (let j = 0; j < simplexGreedy.Initial_n; ++j) {
          row += ` ${simplexGreedy.Initial_BIA_aux[i][j].toFixed(2)} `;
        }
        console.log(row);
      }

      console.log("\nInitial_A_aux (B,D):\n");
      for (let i = 0; i < simplexGreedy.m; ++i) {
        let row = "";
        for (let j = 0; j < simplexGreedy.Initial_n; ++j) {
          row += ` ${simplexGreedy.Initial_A_aux[i][j].toFixed(2)} `;
        }
        console.log(row);
      }

      console.log("Initial_b:\n");
      console.log(simplexGreedy.Initial_b.join(" "));

      this.matrixVectorMult(
        simplexGreedy.Initial_BIb,
        simplexGreedy.Initial_BI,
        simplexGreedy.Initial_b,
        simplexGreedy.m,
        simplexGreedy.m
      );
      simplexGreedy.eraseEpsilonsVector(
        simplexGreedy.Initial_BIb,
        simplexGreedy.m
      );

      simplexGreedy.copySubmatrix(
        simplexGreedy.Initial_D,
        simplexGreedy.Initial_A_aux,
        0,
        simplexGreedy.m,
        simplexGreedy.m,
        simplexGreedy.Initial_n - simplexGreedy.m
      );
      console.log("Initial_D:\n");
      for (let i = 0; i < simplexGreedy.m; ++i) {
        let row = "";
        for (let j = 0; j < simplexGreedy.Initial_n - simplexGreedy.m; ++j) {
          row += ` ${simplexGreedy.Initial_D[i][j].toFixed(2)} `;
        }
        console.log(row);
      }

      this.computeInitialCbInitialCd();





      simplexGreedy.vectorMatrixMult(
        simplexGreedy.Initial_cbBI,
        simplexGreedy.Initial_cb,
        simplexGreedy.Initial_BI,
        simplexGreedy.m,
        simplexGreedy.m
      );
      simplexGreedy.eraseEpsilonsVector(
        simplexGreedy.Initial_cbBI,
        simplexGreedy.m
      );


      simplexGreedy.vectorMatrixMult(
        simplexGreedy.Initial_cbBID,
        simplexGreedy.Initial_cbBI,
        simplexGreedy.Initial_D,
        simplexGreedy.m,
        simplexGreedy.Initial_n - simplexGreedy.m
      );
      simplexGreedy.eraseEpsilonsVector(
        simplexGreedy.Initial_cbBID,
        simplexGreedy.Initial_n - simplexGreedy.m
      );


      simplexGreedy.vectorSubtract(
        simplexGreedy.Initial_rd,
        simplexGreedy.Initial_cd,
        simplexGreedy.Initial_cbBID,
        simplexGreedy.Initial_n - simplexGreedy.m
      );
      simplexGreedy.eraseEpsilonsVector(
        simplexGreedy.Initial_rd,
        simplexGreedy.Initial_n - simplexGreedy.m
      );
      console.log("\nInitial_rd( cd - cbBID ):\n");
      for (let i = 0; i < simplexGreedy.Initial_n - simplexGreedy.m; i++) {
        console.log(` ${simplexGreedy.Initial_rd[i].toFixed(2)} `);
      }

      const minValue = simplexGreedy.findMinValue(
        simplexGreedy.Initial_rd,
        simplexGreedy.Initial_n - simplexGreedy.m
      );
      if (minValue >= 0.0) {
        optimalFlag = 1;
      } else {
        const enterId = this.findInitialMostNegative();
        const exitingId = this.findInitialExitingId(
          simplexGreedy.Initial_BIA_aux,
          simplexGreedy.Initial_BIb,
          enterId,
          simplexGreedy.Initial_n,
          simplexGreedy.m,
          simplexGreedy
        );
        console.log(
          `\nenter_id  = ${enterId},  exiting_id = ${exitingId}, Initial_d[exiting_id] = ${simplexGreedy.Initial_d[exitingId]}`
        );
        simplexGreedy.Initial_basis[exitingId] = enterId;
        console.log("\nInitial_basis:\n");
        for (let i = 0; i < simplexGreedy.m; ++i) {
          console.log(" d ", simplexGreedy.Initial_basis[i]);
        }
      }
    }
  }

  findInitialExitingId(y, x, enter_id, n, m) {
    let temp_min_index = 0;
    let init_flag = 0;
    let q = 0;
    let temp_min = 0.0;
    let temp = 0.0;

    for (let i = 0; i < simplexGreedy.Initial_n; ++i) {
      if (simplexGreedy.Initial_d[i] === enter_id) {
        q = i;
      }
    }

    init_flag = 0;

    for (let i = 0; i < m; ++i) {
      console.log(`y[${i}][${q}] = ${y[i][q]}, x[${i}] = ${x[i]}`);
      console.log(`init_flag = ${init_flag}`);
      if (y[i][q] > 0.0) {
        temp = x[i] / y[i][q];
        console.log(`i = ${i}, temp = ${temp}`);
        if (init_flag === 0) {
          temp_min = temp;
          temp_min_index = i;
          init_flag = 1;
        } else if (temp < temp_min) {
          temp_min = temp;
          temp_min_index = i;
        }
      }

      console.log(
        `temp_min_index  = ${temp_min_index}, temp_min  = ${temp_min}`
      );
    }

    return temp_min_index;
  }

  findInitialMostNegative() {
    let mostIndex = simplexGreedy.Initial_d[simplexGreedy.m];
    let tempValue = simplexGreedy.Initial_rd[0];

    for (let i = 0; i < simplexGreedy.Initial_n - simplexGreedy.m; ++i) {
      if (simplexGreedy.Initial_rd[i] < tempValue) {
        mostIndex = simplexGreedy.Initial_d[simplexGreedy.m + i];
        tempValue = simplexGreedy.Initial_rd[i];
      }
    }

    return mostIndex;
  }

  computeInitialCbInitialCd() {
    for (let i = 0; i < simplexGreedy.m; ++i) {
      simplexGreedy.Initial_cb[i] =
        simplexGreedy.Initial_c[simplexGreedy.Initial_d[i]];
    }

    for (let i = simplexGreedy.m; i < simplexGreedy.Initial_n; ++i) {
      simplexGreedy.Initial_cd[i - simplexGreedy.m] =
        simplexGreedy.Initial_c[simplexGreedy.Initial_d[i]];
    }

    console.log("Initial_d:");
    for (let i = 0; i < simplexGreedy.Initial_n; ++i) {
      console.log(" " + simplexGreedy.Initial_d[i]);
    }

    console.log("Initial_cb:");
    for (let i = 0; i < simplexGreedy.m; ++i) {
      console.log(" " + simplexGreedy.Initial_cb[i]);
    }

    console.log("Initial_cd:");
    for (let i = 0; i < simplexGreedy.Initial_n - simplexGreedy.m; ++i) {
      console.log(" " + simplexGreedy.Initial_cd[i]);
    }
  }

  matrixVectorMult(c, A, b, n, m) {
    for (let i = 0; i < n; ++i) {
      let sum = 0.0;

      for (let k = 0; k < m; ++k) {
        sum += A[i][k] * b[k];
      }

      c[i] = sum;
    }
  }

  setInitialAAux() {
    for (let i = 0; i < simplexGreedy.Initial_n; ++i) {
      let k = simplexGreedy.Initial_d[i];

      for (let j = 0; j < simplexGreedy.m; ++j) {
        simplexGreedy.Initial_A_aux[j][i] = simplexGreedy.Initial_A[j][k];
      }
    }
  }

  initialSetD() {
    for (let i = 0; i < simplexGreedy.m; ++i) {
      simplexGreedy.Initial_d[i] = simplexGreedy.Initial_basis[i];
    }

    let pos = simplexGreedy.m;

    for (let i = 0; i < simplexGreedy.Initial_n; ++i) {
      let flag = 1;

      for (let j = 0; j < simplexGreedy.m && flag; ++j) {
        if (i === simplexGreedy.Initial_basis[j]) {
          flag = 0;
        }
      }

      if (flag == 1) {
        simplexGreedy.Initial_d[pos++] = i;
      }
    }
  }

  printInitialSolution() {
    console.log("\nInitial basis:");

    for (let i = 0; i < simplexGreedy.m; ++i) {
      console.log(" " + simplexGreedy.Initial_basis[i]);
    }

    console.log("\nBasic Solution:");

    for (let i = 0; i < simplexGreedy.m; ++i) {
      console.log(
        " X" +
          simplexGreedy.Initial_basis[i] +
          " = " +
          simplexGreedy.Initial_BIb[i]
      );
    }
  }

  printNoSolution() {
    console.log("System A has NO solution");
  }

  printSolution() {
    console.log("\nbasis:");

    for (let i = 0; i < simplexGreedy.m; ++i) {
      console.log(" " + simplexGreedy.basis[i]);
    }

    console.log("\nBasic Solution:");
    let finalSolutionString = "Basic Solution:\n";

    for (let i = 0; i < simplexGreedy.m; ++i) {
      console.log(
        " X" + (simplexGreedy.basis[i] + 1) + " = " + simplexGreedy.BIb[i]
      );
      finalSolutionString += " X" + (simplexGreedy.basis[i] + 1) + " = " + simplexGreedy.BIb[i] + '\n';
    }

    console.log("\nSolution value:");
    finalSolutionString += "\nSolution value:\n";

    let temp = simplexGreedy.c[simplexGreedy.basis[0]] * simplexGreedy.BIb[0];
    let sum = temp;
    console.log(
      " " +
        simplexGreedy.c[simplexGreedy.basis[0]] +
        " * " +
        simplexGreedy.BIb[0]
    );
    finalSolutionString += " " + simplexGreedy.c[simplexGreedy.basis[0]] + " * " +simplexGreedy.BIb[0];

    for (let i = 1; i < simplexGreedy.m; ++i) {
      temp = simplexGreedy.c[simplexGreedy.basis[i]] * simplexGreedy.BIb[i];
      sum += temp;
      console.log(
        " + " +
          simplexGreedy.c[simplexGreedy.basis[i]] +
          " * " +
          simplexGreedy.BIb[i]
      );
      finalSolutionString += " + " + simplexGreedy.c[simplexGreedy.basis[i]] + " * " +simplexGreedy.BIb[i];
    }

    console.log(" = " + sum);
    finalSolutionString += " = " + sum;
    return finalSolutionString;
  }

  readFile(data) {
    let i, j;

    let str = data.shift().trim();
    console.log(`str = ${str}`);

    str = data.shift().trim();
    const cParts = str.split(" ");
    for (i = 0; i < cParts.length; ++i) {
      simplexGreedy.c[i] = parseFloat(cParts[i]);
    }

    for (i = 0; i < simplexGreedy.n; i++) {
      console.log(`c[${i}] = ${simplexGreedy.c[i]}`);
    }

    str = data.shift().trim();
    console.log(`str = ${str}`); // A:

    for (i = 0; i < simplexGreedy.m; i++) {
      str = data.shift().trim();
      const parts = str.split(" ");
      const cleanParts = parts
        .map((part) => part.trim())
        .filter((part) => part !== "");
      for (j = 0; j < simplexGreedy.n; j++) {
        simplexGreedy.A[i][j] = parseFloat(cleanParts[j]);
      }
    }

    for (i = 0; i < simplexGreedy.m; i++) {
      let row = "";
      for (j = 0; j < simplexGreedy.n; j++) {
        row += ` ${simplexGreedy.A[i][j]} `;
      }
      console.log(row);
    }

    str = data.shift().trim();
    console.log(`str = ${str}`); // b:

    str = data.shift().trim();
    const bParts = str.split(" ");
    for (i = 0; i < simplexGreedy.m; i++) {
      simplexGreedy.b[i] = parseFloat(bParts[i]);
    }

    str = data.shift().trim(); // "epsilon:"
    console.log(`str = ${str}`);

    str = data.shift().trim();
    simplexGreedy.epsilon = parseFloat(str);

    console.log("b:");
    for (i = 0; i < simplexGreedy.m; i++) {
      console.log(` ${simplexGreedy.b[i]} `);
    }

    this.copyMatrix(
      simplexGreedy.A_aux,
      simplexGreedy.A,
      simplexGreedy.n,
      simplexGreedy.m
    );
  }

  copyMatrix(Dest, Source, n, m) {
    for (let i = 0; i < m; ++i) {
      for (let j = 0; j < n; ++j) {
        Dest[i][j] = Source[i][j];
      }
    }
  }
}

//const mainobj = new Main();
//mainobj.enter();
