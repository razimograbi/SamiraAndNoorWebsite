import SimplexBland from "./SimplexBland.js";
//import fs from "fs";
const simplexBland = new SimplexBland();
//const filePath = "Bland/simplex.txt";

export class BlandMain {
  enter(fileInputElement) {
    let indexI = 0;
    let indexJ = 0;
    let n_p_m = 0;
    let itemp = 0;
    try {
      //const data = fs.readFileSync(filePath, "utf8").split("\n");
      const reader = new FileReader();
      let data = null;
      reader.onload = (e)=>{
        data = e.target.result;
        data = data.split("\n");
        let str = data.shift().trim();
        console.log(`str = ${str}`);

        str = data.shift().trim();
        const parts = str.split(" ");

        simplexBland.m = parseInt(parts[0], 10);
        simplexBland.n = parseInt(parts[1], 10);
        console.log(`n = ${simplexBland.n}, m = ${simplexBland.m}`);

        simplexBland.Initial_n = simplexBland.n + simplexBland.m;

        n_p_m = simplexBland.n + simplexBland.m;

        this.readFile(data);

        console.log(`\nepsilon = ${simplexBland.epsilon}`);

        console.log(" A: ");
        this.printOriginalSystem(simplexBland.A, simplexBland.n, simplexBland.m);

        this.copyToInitialMatrix();

        console.log("Initial_A:");
        for (indexI = 0; indexI < simplexBland.m; indexI++) {
            let row = "";
            for (indexJ = 0; indexJ < n_p_m; indexJ++)
            row += ` ${simplexBland.Initial_A[indexI][indexJ].toFixed(2)} `;
            console.log(row);
        }

        for (indexI = 0; indexI < simplexBland.m; indexI++)
            simplexBland.Initial_basis[indexI] = indexI + simplexBland.n;
        for (indexI = 0; indexI < simplexBland.n; indexI++)
            simplexBland.Initial_c[indexI] = 0.0;
        for (indexI = simplexBland.n; indexI < simplexBland.Initial_n; indexI++)
            simplexBland.Initial_c[indexI] = 1.0;
        for (indexI = 0; indexI < simplexBland.m; indexI++)
            simplexBland.Initial_b[indexI] = simplexBland.b[indexI];
        for (indexI = 0; indexI < simplexBland.m; indexI++)
            simplexBland.Initial_b_aux[indexI] = simplexBland.b[indexI];

        console.log("\nInitial_basis:");
        console.log(simplexBland.Initial_basis.join(" "));

        console.log("\nInitial_c:");
        console.log(
            simplexBland.Initial_c.map((val) => val.toFixed(2)).join(" ")
        );

        console.log("\nInitial_b:");
        console.log(
            simplexBland.Initial_b.map((val) => val.toFixed(2)).join(" ")
        );

        this.initialSimplexAlgorithm();

        for (indexI = 0; indexI < simplexBland.m; indexI++) {
            itemp = simplexBland.Initial_basis[indexI];
            simplexBland.basis[indexI] = itemp;
            if (itemp >= simplexBland.n) {
            this.printNoSolution();
            return 0;
            }
        }

        this.printInitialSolution();

        simplexBland.simplexAlgorithm();

        this.bublesortD(simplexBland.basis, simplexBland.BIb, simplexBland.m);

        const finalSoultionParagraph = document.querySelector('.final-solution-output');
        finalSoultionParagraph.innerHTML = this.printSolution().replace(/\n/g, '<br>');

      };
      reader.readAsText(fileInputElement.files[0]);
    }catch (error) {
      console.error(error.message);
      return;
    }
      
  }

  copyToInitialMatrix() {
    for (let i = 0; i < simplexBland.m; i++) {
      for (let j = 0; j < simplexBland.n; j++) {
        simplexBland.Initial_A[i][j] = simplexBland.Initial_A_aux[i][j] =
          simplexBland.A[i][j];
      }
    }

    for (let i = 0; i < simplexBland.m; i++) {
      for (let j = simplexBland.n; j < simplexBland.n + simplexBland.m; j++) {
        if (i === j - simplexBland.n) {
          simplexBland.Initial_A[i][j] = simplexBland.Initial_A_aux[i][j] = 1.0;
        } else {
          simplexBland.Initial_A[i][j] = simplexBland.Initial_A_aux[i][j] = 0.0;
        }
      }
    }
  }

  printOriginalSystem(A, n, m) {
    console.log("Original System:");

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) console.log(A[i][j]);
      console.log();
    }
  }

  bublesortD(array, darr, n) {
    let i, j, limit, flag, temp;
    let dtemp;

    flag = 1;
    for (i = 0; i < n && flag === 1; i++) {
      flag = 0;
      limit = n - i - 1;
      for (j = 0; j < limit; j++) {
        if (array[j] > array[j + 1]) {
          flag = 1;
          dtemp = darr[j];
          darr[j] = darr[j + 1];
          darr[j + 1] = dtemp;
          temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
  }

  initialSimplexAlgorithm() {
    let i, j, optimal_flag, enter_id, exiting_id;
    let min_value;

    optimal_flag = 0;

    console.log(`m = ${simplexBland.m}, Initial_n = ${simplexBland.Initial_n}`);

    console.log("\nInitial_basis:");
    for (i = 0; i < simplexBland.m; i++)
      console.log(` ${simplexBland.Initial_basis[i]} `);
    console.log("\n");

    console.log("Initial_A:");
    for (i = 0; i < simplexBland.m; i++) {
      for (j = 0; j < simplexBland.Initial_n; j++)
        console.log(` ${simplexBland.Initial_A[i][j].toFixed(2)} `);
      console.log("");
    }

    while (optimal_flag === 0) {
      simplexBland.bubbleSort(simplexBland.Initial_basis, simplexBland.m);

      console.log("\nInitial_basis:");
      for (i = 0; i < simplexBland.m; i++)
        console.log(` ${simplexBland.Initial_basis[i]} `);
      console.log("\n");

      this.initialSetD();

      console.log("\nInitial_d:");
      for (i = 0; i < simplexBland.Initial_n; i++)
        console.log(` ${simplexBland.Initial_d[i]} `);
      console.log("\n");

      this.setInitialAAux();

      console.log("\nInitial_A_aux (B, D):");
      for (i = 0; i < simplexBland.m; i++) {
        for (j = 0; j < simplexBland.Initial_n; j++)
          console.log(` ${simplexBland.Initial_A_aux[i][j].toFixed(2)} `);
        console.log("");
      }

      simplexBland.copySubmatrix(
        simplexBland.Initial_B,
        simplexBland.Initial_A_aux,
        0,
        simplexBland.m,
        0,
        simplexBland.m
      );

      console.log("\nInitial_B:");
      for (i = 0; i < simplexBland.m; i++) {
        for (j = 0; j < simplexBland.m; j++)
          console.log(` ${simplexBland.Initial_B[i][j].toFixed(2)} `);
        console.log("");
      }

      simplexBland.invGaussian(
        simplexBland.Initial_BI,
        simplexBland.Initial_B,
        simplexBland.m
      );

      simplexBland.eraseEpsilonsMatrix(
        simplexBland.Initial_BI,
        simplexBland.m,
        simplexBland.m
      );

      console.log("\nInitial_BI:");
      for (i = 0; i < simplexBland.m; i++) {
        for (j = 0; j < simplexBland.m; j++)
          console.log(` ${simplexBland.Initial_BI[i][j].toFixed(2)} `);
        console.log("");
      }

      simplexBland.matrixMult(
        simplexBland.Initial_BIA_aux,
        simplexBland.Initial_BI,
        simplexBland.Initial_A_aux,
        simplexBland.m,
        simplexBland.m,
        simplexBland.Initial_n
      );

      simplexBland.eraseEpsilonsMatrix(
        simplexBland.Initial_BIA_aux,
        simplexBland.m,
        simplexBland.Initial_n
      );

      console.log("\nInitial_BIA_aux (I, B-1*D):");
      for (i = 0; i < simplexBland.m; i++) {
        for (j = 0; j < simplexBland.Initial_n; j++)
          console.log(` ${simplexBland.Initial_BIA_aux[i][j].toFixed(2)} `);
        console.log("");
      }

      console.log("\nInitial_A_aux (B,D):");
      for (i = 0; i < simplexBland.m; i++) {
        for (j = 0; j < simplexBland.Initial_n; j++)
          console.log(` ${simplexBland.Initial_A_aux[i][j].toFixed(2)} `);
        console.log("");
      }

      console.log("Initial_b:");
      for (i = 0; i < simplexBland.m; i++)
        console.log(` ${simplexBland.Initial_b[i].toFixed(2)} `);

      this.matrixVectorMult(
        simplexBland.Initial_BIb,
        simplexBland.Initial_BI,
        simplexBland.Initial_b,
        simplexBland.m,
        simplexBland.m
      );
      simplexBland.eraseEpsilonsVector(
        simplexBland.Initial_BIb,
        simplexBland.m
      );

      console.log("\nInitial_BIb:");

      for (i = 0; i < simplexBland.m; i++)
        console.log(` ${simplexBland.Initial_BIb[i].toFixed(2)} `);
      console.log("\n");

      simplexBland.copySubmatrix(
        simplexBland.Initial_D,
        simplexBland.Initial_A_aux,
        0,
        simplexBland.m,
        simplexBland.m,
        simplexBland.Initial_n - simplexBland.m
      );

      console.log("Initial_D:");
      for (i = 0; i < simplexBland.m; i++) {
        for (j = 0; j < simplexBland.Initial_n - simplexBland.m; j++)
          console.log(` ${simplexBland.Initial_D[i][j].toFixed(2)} `);
        console.log("");
      }

      this.computeInitialCbInitialCd();

      console.log("\nInitial_cb:");
      for (i = 0; i < simplexBland.m; i++)
        console.log(` ${simplexBland.Initial_cb[i].toFixed(2)} `);
      console.log("\n");

      console.log("\nInitial_cd:");
      for (i = 0; i < simplexBland.Initial_n - simplexBland.m; i++)
        console.log(` ${simplexBland.Initial_cd[i].toFixed(2)} `);
      console.log("\n");

      // cbBI = cb * B-1
      simplexBland.vectorMatrixMult(
        simplexBland.Initial_cbBI,
        simplexBland.Initial_cb,
        simplexBland.Initial_BI,
        simplexBland.m,
        simplexBland.m
      );
      simplexBland.eraseEpsilonsVector(
        simplexBland.Initial_cbBI,
        simplexBland.m
      );

      console.log("\nInitial_cbBI:");
      for (i = 0; i < simplexBland.m; i++)
        console.log(` ${simplexBland.Initial_cbBI[i].toFixed(2)} `);
      console.log("\n");

      simplexBland.vectorMatrixMult(
        simplexBland.Initial_cbBID,
        simplexBland.Initial_cbBI,
        simplexBland.Initial_D,
        simplexBland.m,
        simplexBland.Initial_n - simplexBland.m
      );
      simplexBland.eraseEpsilonsVector(
        simplexBland.Initial_cbBID,
        simplexBland.Initial_n - simplexBland.m
      );

      console.log("\nInitial_cbBID:");
      for (i = 0; i < simplexBland.Initial_n - simplexBland.m; i++)
        console.log(` ${simplexBland.Initial_cbBID[i].toFixed(2)} `);
      console.log("\n");

      simplexBland.vectorSubtract(
        simplexBland.Initial_rd,
        simplexBland.Initial_cd,
        simplexBland.Initial_cbBID,
        simplexBland.Initial_n - simplexBland.m
      );
      simplexBland.eraseEpsilonsVector(
        simplexBland.Initial_rd,
        simplexBland.Initial_n - simplexBland.m
      );

      console.log("\nInitial_rd( cd - cbBID ):");
      for (i = 0; i < simplexBland.Initial_n - simplexBland.m; i++)
        console.log(` ${simplexBland.Initial_rd[i].toFixed(2)} `);
      console.log("\n\n");

      min_value = simplexBland.findMinValue(
        simplexBland.Initial_rd,
        simplexBland.Initial_n - simplexBland.m
      );
      if (min_value >= 0.0) optimal_flag = 1;
      else {
        enter_id = this.findInitialMostNegative();
        exiting_id = this.findInitialExitingId(
          simplexBland.Initial_BIA_aux,
          simplexBland.Initial_BIb,
          enter_id,
          simplexBland.Initial_n,
          simplexBland.m,
          simplexBland
        );
        console.log(
          `\nenter_id  = ${enter_id},  exiting_id = ${exiting_id}, Initial_d[exiting_id] = ${simplexBland.Initial_d[exiting_id]}\n`
        );
        simplexBland.Initial_basis[exiting_id] = enter_id;
        console.log("\nInitial_basis:");
        for (i = 0; i < simplexBland.m; i++)
          console.log(` ${simplexBland.Initial_basis[i]} `);
        console.log("\n");
      }
    }
  }

  findInitialExitingId(y, x, enter_id, n, m) {
    let i = 0;
    let temp_min_index = 0;
    let init_flag = 0;
    let q = 0;
    let temp_min = 0.0;
    let temp = 0.0;

    for (i = 0; i < simplexBland.Initial_n; i++) {
      if (simplexBland.Initial_d[i] === enter_id) {
        q = i;
        break; // Exit the loop once q is found.
      }
    }

    init_flag = 0;
    for (i = 0; i < m; i++) {
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
    // Assumptions: d[i] is original index, rd ordered by i = 0, ..., n-1
    // d[0] ... d[n-1]

    let most_index = simplexBland.Initial_d[simplexBland.m];
    let temp_value = simplexBland.Initial_rd[0];

    for (let i = 0; i < simplexBland.Initial_n - simplexBland.m; i++) {
      if (simplexBland.Initial_rd[i] < temp_value) {
        most_index = simplexBland.Initial_d[simplexBland.m + i];
        temp_value = simplexBland.Initial_rd[i];
      }
    }

    return most_index;
  }

  computeInitialCbInitialCd() {
    for (let i = 0; i < simplexBland.m; i++) {
      simplexBland.Initial_cb[i] =
        simplexBland.Initial_c[simplexBland.Initial_d[i]];
    }

    for (let i = simplexBland.m; i < simplexBland.Initial_n; i++) {
      simplexBland.Initial_cd[i - simplexBland.m] =
        simplexBland.Initial_c[simplexBland.Initial_d[i]];
    }

    console.log("Initial_d:");
    for (let i = 0; i < simplexBland.Initial_n; i++) {
      console.log(` ${simplexBland.Initial_d[i]} `);
    }
    console.log("\n");

    console.log("Initial_cb:");
    for (let i = 0; i < simplexBland.m; i++) {
      console.log(` ${simplexBland.Initial_cb[i]} `);
    }
    console.log("\n");

    console.log("Initial_cd:");
    for (let i = 0; i < simplexBland.Initial_n - simplexBland.m; i++) {
      console.log(` ${simplexBland.Initial_cd[i]} `);
    }
    console.log("\n");
  }

  matrixVectorMult(c, A, b, n, m) {
    for (let i = 0; i < n; i++) {
      let sum = 0.0;
      for (let k = 0; k < m; k++) {
        sum += A[i][k] * b[k];
      }
      c[i] = sum;
    }
  }

  setInitialAAux() {
    for (let i = 0; i < simplexBland.Initial_n; i++) {
      let k = simplexBland.Initial_d[i];
      for (let j = 0; j < simplexBland.m; j++) {
        simplexBland.Initial_A_aux[j][i] = simplexBland.Initial_A[j][k];
      }
    }
  }

  initialSetD() {
    for (let i = 0; i < simplexBland.m; i++) {
      simplexBland.Initial_d[i] = simplexBland.Initial_basis[i];
    }

    let pos = simplexBland.m;
    for (let i = 0; i < simplexBland.Initial_n; i++) {
      let flag = 1;
      for (let j = 0; j < simplexBland.m && flag === 1; j++) {
        if (i === simplexBland.Initial_basis[j]) {
          flag = 0;
        }
      }
      if (flag === 1) {
        simplexBland.Initial_d[pos++] = i;
      }
    }
  }

  printInitialSolution() {
    console.log("\nInitial basis:");
    for (let i = 0; i < simplexBland.m; i++) {
      console.log(` ${simplexBland.Initial_basis[i]} `);
    }
    console.log("\n");

    console.log("\nBasic Solution:");
    for (let i = 0; i < simplexBland.m; i++) {
      console.log(
        ` X${simplexBland.Initial_basis[i]} = ${simplexBland.Initial_BIb[i]} `
      );
    }
    console.log("\n");
  }

  printNoSolution() {
    const finalSoultionParagraph = document.querySelector('.final-solution-output');
    finalSoultionParagraph.innerHTML = "System A has NO solution";
  }

  printSolution() {
    let i;
    let sum = 0;
    let temp;

    let finalSolutionString = "Basic Solution:\n";

    console.log("\nbasis:");
    for (i = 0; i < simplexBland.m; i++) {
      console.log(` ${simplexBland.basis[i]} `);
    }
    console.log("\n");

    console.log("\nBasic Solution:");
    for (i = 0; i < simplexBland.m; i++) {
      console.log(` X${simplexBland.basis[i] + 1} = ${simplexBland.BIb[i]} `);
      finalSolutionString += ` X${simplexBland.basis[i] + 1} = ${simplexBland.BIb[i]} \n`;
    }
    console.log("\n");
    finalSolutionString += '\n';

    console.log("\nSolution value:");
    finalSolutionString += "Solution value:\n"

    temp = simplexBland.c[simplexBland.basis[0]] * simplexBland.BIb[0];
    sum = temp;
    console.log(
      ` ${simplexBland.c[simplexBland.basis[0]]} * ${simplexBland.BIb[0]} `
    );
    finalSolutionString += ` ${simplexBland.c[simplexBland.basis[0]]} * ${simplexBland.BIb[0]} \n`;

    for (i = 1; i < simplexBland.m; i++) {
      temp = simplexBland.c[simplexBland.basis[i]] * simplexBland.BIb[i];
      sum += temp;
      console.log(
        ` +  ${simplexBland.c[simplexBland.basis[i]]} * ${simplexBland.BIb[i]} `
      );
      finalSolutionString += ` +  ${simplexBland.c[simplexBland.basis[i]]} * ${simplexBland.BIb[i]}`;
    }

    console.log(` = ${sum}\n`);
    finalSolutionString += ` = ${sum}\n`;
    return finalSolutionString;
  }

  readFile(data) {
    let i, j;

    let str = data.shift().trim();
    console.log(`str = ${str}`);

    str = data.shift().trim();
    const cParts = str.split(" ");
    for (i = 0; i < cParts.length; ++i) {
      simplexBland.c[i] = parseFloat(cParts[i]);
    }

    for (i = 0; i < simplexBland.n; i++) {
      console.log(`c[${i}] = ${simplexBland.c[i]}`);
    }

    str = data.shift().trim();
    console.log(`str = ${str}`); // A:

    for (i = 0; i < simplexBland.m; i++) {
      str = data.shift().trim();
      const parts = str.split(" ");
      const cleanParts = parts
        .map((part) => part.trim())
        .filter((part) => part !== "");
      for (j = 0; j < simplexBland.n; j++) {
        simplexBland.A[i][j] = parseFloat(cleanParts[j]);
      }
    }

    for (i = 0; i < simplexBland.m; i++) {
      let row = "";
      for (j = 0; j < simplexBland.n; j++) {
        row += ` ${simplexBland.A[i][j]} `;
      }
      console.log(row);
    }

    str = data.shift().trim();
    console.log(`str = ${str}`); // b:

    str = data.shift().trim();
    const bParts = str.split(" ");
    for (i = 0; i < simplexBland.m; i++) {
      simplexBland.b[i] = parseFloat(bParts[i]);
    }

    str = data.shift().trim(); // "epsilon:"
    console.log(`str = ${str}`);

    str = data.shift().trim();
    simplexBland.epsilon = parseFloat(str);

    console.log("b:");
    for (i = 0; i < simplexBland.m; i++) {
      console.log(` ${simplexBland.b[i]} `);
    }

    this.copyMatrix(
      simplexBland.A_aux,
      simplexBland.A,
      simplexBland.n,
      simplexBland.m
    );
  }

  copyMatrix(Dest, Source, n, m) {
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        Dest[i][j] = Source[i][j];
      }
    }
  }
}


//const mainObj = new Main();
//mainObj.enter();
