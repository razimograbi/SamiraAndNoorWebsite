import {SimplexBest} from "./SimplexBest.js";

const simplexBest = new SimplexBest();

export class BestMain {
  enter(fileInputElement) {
    let indexI = 0;
    let indexJ = 0;
    let n_p_m = 0;
    let itemp = 0;

    try {
      const reader = new FileReader();
      let data = null;
      reader.onload = (e)=>{
        data = e.target.result;
        data = data.split("\n");
        try{
          //const data = fs.readFileSync(filePath, "utf8").split("\n");
          let indexI, indexJ, itemp, n_p_m;
    
          let str = data.shift().trim();
    
          // Read values of m and n
          str = data.shift().trim();
          const parts = str.split(" ");
    
          simplexBest.m = parseInt(parts[0], 10);
          simplexBest.n = parseInt(parts[1], 10);
    
          simplexBest.Initial_n = simplexBest.n + simplexBest.m;
    
          n_p_m = simplexBest.n + simplexBest.m;
    
          this.readFile(data);

          //this.printOriginalSystem(simplexBest.A, simplexBest.n, simplexBest.m);
    
          this.copyToInitialMatrix();
    
          for (indexI = 0; indexI < simplexBest.m; indexI++) {
            let row = "";
            for (indexJ = 0; indexJ < n_p_m; indexJ++)
              row += ` ${simplexBest.Initial_A[indexI][indexJ].toFixed(2)} `;
          }
    
          for (indexI = 0; indexI < simplexBest.m; indexI++)
            simplexBest.Initial_basis[indexI] = indexI + simplexBest.n;
          for (indexI = 0; indexI < simplexBest.n; indexI++)
            simplexBest.Initial_c[indexI] = 0.0;
          for (indexI = simplexBest.n; indexI < simplexBest.Initial_n; indexI++)
            simplexBest.Initial_c[indexI] = 1.0;
          for (indexI = 0; indexI < simplexBest.m; indexI++)
            simplexBest.Initial_b[indexI] = simplexBest.b[indexI];
          for (indexI = 0; indexI < simplexBest.m; indexI++)
            simplexBest.Initial_b_aux[indexI] = simplexBest.b[indexI];
    
    
          this.initialSimplexAlgorithm(simplexBest);
    
          for (indexI = 0; indexI < simplexBest.m; indexI++) {
            itemp = simplexBest.Initial_basis[indexI];
            simplexBest.basis[indexI] = itemp;
            if (itemp >= simplexBest.n) {
              this.printNoSolution();
              return 0;
            }
          }
    
          //this.printInitialSolution();
    
          const algosolution = simplexBest.simplexAlgorithm();

          if(algosolution === "NONE"){
            return 0;
          }
    
          this.bublesortD(simplexBest.basis, simplexBest.BIb, simplexBest.m);
          //console.log("Finished Reading");
          const finalSoultionParagraph = document.querySelector('.final-solution-output');
          finalSoultionParagraph.innerHTML = this.printSolution().replace(/\n/g, '<br>');
        } catch (error) {
          console.error(error.message);
          return;
        }
      };
      reader.readAsText(fileInputElement.files[0]);
    }catch(error){
      console.log(error);
    }
  }

  copyToInitialMatrix() {
    for (let i = 0; i < simplexBest.m; i++) {
      for (let j = 0; j < simplexBest.n; j++) {
        simplexBest.Initial_A[i][j] = simplexBest.Initial_A_aux[i][j] =
          simplexBest.A[i][j];
      }
    }

    for (let i = 0; i < simplexBest.m; i++) {
      for (let j = simplexBest.n; j < simplexBest.n + simplexBest.m; j++) {
        if (i === j - simplexBest.n) {
          simplexBest.Initial_A[i][j] = simplexBest.Initial_A_aux[i][j] = 1.0;
        } else {
          simplexBest.Initial_A[i][j] = simplexBest.Initial_A_aux[i][j] = 0.0;
        }
      }
    }
  }

  /*
  printOriginalSystem(A, n, m) {

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) console.log(A[i][j]);
      console.log();
    }
  }
  */

  bublesortD(array, darr, n) {
    let i, j, limit, flag;
    let temp, dtemp;

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
    let i, j, optimalFlag, enter_id, exiting_id;
    let min_value;

    optimalFlag = 0;

    console.log(`m = ${simplexBest.m}, Initial_n = ${simplexBest.Initial_n}`);

    console.log("\nInitial_basis:");
    console.log(simplexBest.Initial_basis.join(" "));

    console.log("Initial_A:");
    for (i = 0; i < simplexBest.m; i++) {
      let row = "";
      for (j = 0; j < simplexBest.Initial_n; j++) {
        row += ` ${simplexBest.Initial_A[i][j].toFixed(2)}`;
      }
      console.log(row);
    }

    while (optimalFlag === 0) {
      simplexBest.bubbleSort(simplexBest.Initial_basis, simplexBest.m);

      console.log("\nInitial_basis:");
      console.log(simplexBest.Initial_basis.join(" "));

      this.initialSetD(simplexBest);

      console.log("\nInitial_d:");
      console.log(simplexBest.Initial_d.join(" "));

      this.setInitialAAux();

      console.log("\nInitial_A_aux (B, D):");
      for (i = 0; i < simplexBest.m; i++) {
        let row = "";
        for (j = 0; j < simplexBest.Initial_n; j++) {
          row += ` ${simplexBest.Initial_A_aux[i][j].toFixed(2)}`;
        }
        console.log(row);
      }

      simplexBest.copySubmatrix(
        simplexBest.Initial_B,
        simplexBest.Initial_A_aux,
        0,
        simplexBest.m,
        0,
        simplexBest.m
      );

      console.log("\nInitial_B:");
      for (i = 0; i < simplexBest.m; i++) {
        let row = "";
        for (j = 0; j < simplexBest.m; j++) {
          row += ` ${simplexBest.Initial_B[i][j].toFixed(2)}`;
        }
        console.log(row);
      }

      simplexBest.invGaussian(
        simplexBest.Initial_BI,
        simplexBest.Initial_B,
        simplexBest.m
      );

      simplexBest.eraseEpsilonsMatrix(
        simplexBest.Initial_BI,
        simplexBest.m,
        simplexBest.m
      );

      console.log("\nInitial_BI:");
      for (i = 0; i < simplexBest.m; i++) {
        let row = "";
        for (j = 0; j < simplexBest.m; j++) {
          row += ` ${simplexBest.Initial_BI[i][j].toFixed(2)}`;
        }
        console.log(row);
      }

      simplexBest.matrixMult(
        simplexBest.Initial_BIA_aux,
        simplexBest.Initial_BI,
        simplexBest.Initial_A_aux,
        simplexBest.m,
        simplexBest.m,
        simplexBest.Initial_n
      );
      simplexBest.eraseEpsilonsMatrix(
        simplexBest.Initial_BIA_aux,
        simplexBest.m,
        simplexBest.Initial_n
      );

      console.log("\nInitial_BIA_aux (I, B-1*D):");
      for (i = 0; i < simplexBest.m; i++) {
        let row = "";
        for (j = 0; j < simplexBest.Initial_n; j++) {
          row += ` ${simplexBest.Initial_BIA_aux[i][j].toFixed(2)}`;
        }
        console.log(row);
      }

      console.log("\nInitial_A_aux (B, D):");
      for (i = 0; i < simplexBest.m; i++) {
        let row = "";
        for (j = 0; j < simplexBest.Initial_n; j++) {
          row += ` ${simplexBest.Initial_A_aux[i][j].toFixed(2)}`;
        }
        console.log(row);
      }

      console.log("Initial_b:");
      console.log(simplexBest.Initial_b.join(" "));

      this.matrixVectorMult(
        simplexBest.Initial_BIb,
        simplexBest.Initial_BI,
        simplexBest.Initial_b,
        simplexBest.m,
        simplexBest.m
      );
      simplexBest.eraseEpsilonsVector(simplexBest.Initial_BIb, simplexBest.m);

      console.log("\nInitial_BIb:");
      console.log(simplexBest.Initial_BIb.join(" "));

      simplexBest.copySubmatrix(
        simplexBest.Initial_D,
        simplexBest.Initial_A_aux,
        0,
        simplexBest.m,
        simplexBest.m,
        simplexBest.Initial_n - simplexBest.m
      );

      console.log("Initial_D:");
      for (i = 0; i < simplexBest.m; i++) {
        let row = "";
        for (j = 0; j < simplexBest.Initial_n - simplexBest.m; j++) {
          row += ` ${simplexBest.Initial_D[i][j].toFixed(2)}`;
        }
        console.log(row);
      }

      this.computeInitialCbInitialCd();

      console.log("\nInitial_cb:");
      console.log(simplexBest.Initial_cb.join(" "));

      console.log("\nInitial_cd:");
      console.log(simplexBest.Initial_cd.join(" "));

      simplexBest.vectorMatrixMult(
        simplexBest.Initial_cbBI,
        simplexBest.Initial_cb,
        simplexBest.Initial_BI,
        simplexBest.m,
        simplexBest.m
      );
      simplexBest.eraseEpsilonsVector(simplexBest.Initial_cbBI, simplexBest.m);

      console.log("\nInitial_cbBI:");
      console.log(simplexBest.Initial_cbBI.join(" "));

      simplexBest.vectorMatrixMult(
        simplexBest.Initial_cbBID,
        simplexBest.Initial_cbBI,
        simplexBest.Initial_D,
        simplexBest.m,
        simplexBest.Initial_n - simplexBest.m
      );
      simplexBest.eraseEpsilonsVector(
        simplexBest.Initial_cbBID,
        simplexBest.Initial_n - simplexBest.m
      );

      console.log("\nInitial_cbBID:");
      console.log(simplexBest.Initial_cbBID.join(" "));

      simplexBest.vectorSubtract(
        simplexBest.Initial_rd,
        simplexBest.Initial_cd,
        simplexBest.Initial_cbBID,
        simplexBest.Initial_n - simplexBest.m
      );
      simplexBest.eraseEpsilonsVector(
        simplexBest.Initial_rd,
        simplexBest.Initial_n - simplexBest.m
      );

      console.log("\nInitial_rd( cd - cbBID ):");
      for (let i = 0; i < simplexBest.Initial_n - simplexBest.m; i++) {
        let output = ` ${simplexBest.Initial_rd[i].toFixed(2)} `;
        console.log(output);
      }

      console.log("\n");


      min_value = simplexBest.findMinValue(
        simplexBest.Initial_rd,
        simplexBest.Initial_n - simplexBest.m
      );
      
      if (min_value >= 0) {
        optimalFlag = 1;
      } else {
        enter_id = this.findInitialMostNegative();
        exiting_id = this.findInitialExitingId(
          simplexBest.Initial_BIA_aux,
          simplexBest.Initial_BIb,
          enter_id,
          simplexBest.Initial_n,
          simplexBest.m,
          simplexBest
        );
        console.log(
          `\nenter_id = ${enter_id}, exiting_id = ${exiting_id}, Initial_d[exiting_id] = ${simplexBest.Initial_d[exiting_id]}`
        );
        simplexBest.Initial_basis[exiting_id] = enter_id;
      }
    }
  }

  findInitialExitingId(y, x, enter_id, n, m) {
    let i = 0;
    let j = 0;
    let temp_min_index = 0;
    let init_flag = 0;
    let q = 0;
    let temp_min = 0.0;
    let temp = 0.0;

    for (i = 0; i < simplexBest.Initial_n; i++) {
      if (simplexBest.Initial_d[i] === enter_id) {
        q = i;
      }
    }

    init_flag = 0;
    for (i = 0; i < m; i++) {
      if (y[i][q] > 0.0) {
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

    return temp_min_index;
  }

  findInitialMostNegative() {
    // Assumptions: d[i] is the original index, rd ordered by i = 0, ..., n-1
    // d[0] ... d[n-1]

    let most_index = simplexBest.Initial_d[simplexBest.m];
    let temp_value = simplexBest.Initial_rd[0];

    for (let i = 0; i < simplexBest.Initial_n - simplexBest.m; i++) {
      if (simplexBest.Initial_rd[i] < temp_value) {
        most_index = simplexBest.Initial_d[simplexBest.m + i];
        temp_value = simplexBest.Initial_rd[i];
      }
    }

    return most_index;
  }

  computeInitialCbInitialCd() {
    for (let i = 0; i < simplexBest.m; i++) {
      simplexBest.Initial_cb[i] =
        simplexBest.Initial_c[simplexBest.Initial_d[i]];
    }

    for (let i = simplexBest.m; i < simplexBest.Initial_n; i++) {
      simplexBest.Initial_cd[i - simplexBest.m] =
        simplexBest.Initial_c[simplexBest.Initial_d[i]];
    }

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
    for (let i = 0; i < simplexBest.Initial_n; i++) {
      let k = simplexBest.Initial_d[i];
      for (let j = 0; j < simplexBest.m; j++) {
        simplexBest.Initial_A_aux[j][i] = simplexBest.Initial_A[j][k];
      }
    }
  }

  initialSetD(simplexBest) {
    for (let i = 0; i < simplexBest.m; i++) {
      simplexBest.Initial_d[i] = simplexBest.Initial_basis[i];
    }

    let pos = simplexBest.m;
    for (let i = 0; i < simplexBest.Initial_n; i++) {
      let flag = 1;
      for (let j = 0; j < simplexBest.m && flag === 1; j++) {
        if (i === simplexBest.Initial_basis[j]) {
          flag = 0;
        }
      }
      if (flag === 1) {
        simplexBest.Initial_d[pos++] = i;
      }
    }
  }

  printInitialSolution() {

    console.log("\nBasic Solution:");
    for (let i = 0; i < simplexBest.m; i++) {
      console.log(
        `X${simplexBest.Initial_basis[i]} = ${simplexBest.Initial_BIb[i]}`
      );
    }
  }

  printNoSolution() {
    const finalSoultionParagraph = document.querySelector('.final-solution-output');
    finalSoultionParagraph.innerHTML = "System A has NO solution";
  }

  printSolution() {
    let sum = 0;
    let temp;

    console.log("\nbasis:");
    console.log(simplexBest.basis.join(" "));


    let finalSolutionString = "Basic Solution:\n";

    console.log("\nBasic Solution:");
    for (let i = 0; i < simplexBest.m; i++) {
      console.log(`X${simplexBest.basis[i] + 1} = ${simplexBest.BIb[i]}`);
      finalSolutionString += `X${simplexBest.basis[i] + 1} = ${simplexBest.BIb[i]}\n`;
    }

    console.log("\nSolution value:");
    finalSolutionString += "Solution value:\n";

    temp = simplexBest.c[simplexBest.basis[0]] * simplexBest.BIb[0];
    sum = temp;
    console.log(
      `${simplexBest.c[simplexBest.basis[0]]} * ${simplexBest.BIb[0]}`
    );

    finalSolutionString += `${simplexBest.c[simplexBest.basis[0]]} * ${simplexBest.BIb[0]}`;

    for (let i = 1; i < simplexBest.m; i++) {
      temp = simplexBest.c[simplexBest.basis[i]] * simplexBest.BIb[i];
      sum += temp;
      console.log(
        ` + ${simplexBest.c[simplexBest.basis[i]]} * ${simplexBest.BIb[i]}`
      );
      finalSolutionString += ` + ${simplexBest.c[simplexBest.basis[i]]} * ${simplexBest.BIb[i]}`;
    }

    console.log(` = ${sum}`);
    finalSolutionString += ` = ${sum}`;
    return finalSolutionString;
  }

  readFile(data) {
    let i, j;

    let str = data.shift().trim();

    str = data.shift().trim();
    const cParts = str.split(" ");
    for (i = 0; i < cParts.length; ++i) {
      simplexBest.c[i] = parseFloat(cParts[i]);
    }

    for (i = 0; i < simplexBest.n; i++) {
      console.log(`c[${i}] = ${simplexBest.c[i]}`);
    }

    str = data.shift().trim();
    console.log(`str = ${str}`); // A:

    for (i = 0; i < simplexBest.m; i++) {
      str = data.shift().trim();
      const parts = str.split(" ");
      const cleanParts = parts
        .map((part) => part.trim())
        .filter((part) => part !== "");
      for (j = 0; j < simplexBest.n; j++) {
        simplexBest.A[i][j] = parseFloat(cleanParts[j]);
      }
    }

    for (i = 0; i < simplexBest.m; i++) {
      let row = "";
      for (j = 0; j < simplexBest.n; j++) {
        row += ` ${simplexBest.A[i][j]} `;
      }
      console.log(row);
    }

    str = data.shift().trim();
    console.log(`str = ${str}`); // b:

    str = data.shift().trim();
    const bParts = str.split(" ");
    for (i = 0; i < simplexBest.m; i++) {
      simplexBest.b[i] = parseFloat(bParts[i]);
    }

    str = data.shift().trim(); // "epsilon:"
    console.log(`str = ${str}`);

    str = data.shift().trim();
    simplexBest.epsilon = parseFloat(str);

    console.log("b:");
    for (i = 0; i < simplexBest.m; i++) {
      console.log(` ${simplexBest.b[i]} `);
    }

    this.copyMatrix(
      simplexBest.A_aux,
      simplexBest.A,
      simplexBest.n,
      simplexBest.m
    );
  }

  copyMatrix(Dest, Source, n, m) {
    let i, j;

    for (i = 0; i < m; i++) for (j = 0; j < n; j++) Dest[i][j] = Source[i][j];
  }
}


//const mainobj = new Main();
//mainobj.enter();
