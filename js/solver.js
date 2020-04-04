class Solver{
    constructor(){
        this.pieces = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.res;
    }

    // Array utility functions
    zeros_matrix(n){
        let res = []
        for (let y = 0; y < n; y++) {
            res.push([]);
            for (let x = 0; x < n; x++) {
                res[y].push(0);
            }
        }
        return res;
    }

    array_diff(arr1, arr2){
        let res = [];
        arr1.forEach((i) => {
            if(arr2.indexOf(i) === -1)
                res.push(i);
        });
        return res;
    }
    
    array_inter(arr1, arr2){
        let res = [];
        arr1.forEach((i) => {
            if(arr2.indexOf(i) != -1)
                res.push(i);
        });
        return res;
    }

    count(arr, n){
        let count = 0;
        for(let i = 0; i < arr.length; i++){
            if(arr[i] === n)
                count++;
        }
        return count;
    }
    
    // Game functionality functions
    get_valid_pieces(board, x, y){
        let val_by_row = this.array_diff(this.pieces, board[y]);
        let val_by_col = this.array_diff(this.pieces, board.map(arr => arr[x]));
        let val_by_cross = this.array_inter(val_by_row, val_by_col);
        let tempx = Math.floor(x / 3) * 3, tempy = Math.floor(y / 3) * 3;
        let area_pieces = [];
        for(let i = tempx; i < tempx + 3; i++){
            for(let j = tempy; j < tempy + 3; j++){
                if(board[j][i] === 0)
                    continue
                else
                    area_pieces.push(board[j][i]);
            }
        }
        let val_by_area = this.array_diff(this.pieces, area_pieces);
        let valid_pieces = this.array_inter(val_by_cross, val_by_area);
        return valid_pieces;
    }

    is_valid(board, x, y){
        if(board[y][x] === 0)
            return true;
        let row_values = board[y];
        if(this.count(row_values, board[y][x]) > 1)
            return false;
        let col_values = board.map(arr => arr[x]);
        if(this.count(col_values, board[y][x]) > 1)
            return false;
        let tempx = Math.floor(x / 3) * 3, tempy = Math.floor(y / 3) * 3;
        let area_values = [];
        for(let i = tempx; i < tempx + 3; i++){
            for(let j = tempy; j < tempy + 3; j++){
                if(board[j][i] === 0)
                    continue
                else
                    area_values.push(board[j][i]);
            }
        }
        if(this.count(area_values, board[y][x]) > 1)
            return false;
        return true;
    }

    generate_random_board(){
        let res = this.zeros_matrix(9);
        for(let i = 0; i < 9; i++)
            for(let j = 0; j < 9; j++)
                res[i][j] = this.pieces[Math.floor(Math.random() * this.pieces.length)];
        return res;
    }

    hard_clean(board){
        let cleaned = board.map((arr) => [...arr]);
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(!(this.is_valid(board, i, j)))
                    cleaned[j][i] = 0;
            }
        }
        return cleaned;
    }

    soft_clean(board){
        let cleaned = board.map((arr) => [...arr]);
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(!(this.is_valid(cleaned, i, j)))
                    cleaned[j][i] = 0;   
            }
        }
        return cleaned;
    }

    generate_puzzle(t=17){
        while (true){
            let rb = this.generate_random_board();
            let h_cln = this.hard_clean(rb);
            if(this.valid_board(h_cln, t))
                return h_cln;
            let s_cln = this.soft_clean(rb);
            if(this.valid_board(s_cln, t))
                return s_cln;
        }
    }

    generate_board(){
        let i = 11;
        while(true){
            i--;
            let b = this.generate_puzzle(25);
            console.log("generated");
            this.solve(b);
            console.log("solved");
            if(this.res == null)
                console.log("no solution");
            else
                break;
            if(i <= 0)
                break;
        }
        return this.res;
    }

    valid_board(board, threshhold){
        let count_val_pieces = 0;
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(board[j][i] != 0)
                    count_val_pieces++;   
            }
        }
        if(count_val_pieces >= threshhold)
            return true;
    }

    count_zeros(board){
        let count = 0;
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(board[j][i] === 0){
                    count++;
                }
            }
        }
        return count;
    }

    solve(board){
        for(let x = 0; x < 9; x++){
            for(let y = 0; y < 9; y++){
                if(board[y][x] === 0){
                    for(let i = 0; i < this.pieces.length; i++){
                        let val_p = this.get_valid_pieces(board, x, y);
                        if(val_p.indexOf(this.pieces[i]) != -1){
                            board[y][x] = this.pieces[i];
                            this.solve(board);
                            board[y][x] = 0;
                        }
                    }   
                    return;
                }
            }
        }
        if(this.count_zeros(board) === 0){
            // console.log("solvable");
            this.res = board.map((arr) => [...arr]);
            return;
        }
    }
}

let g = new Generator();
// let arr = [ [0, 0, 1, 0, 0, 0, 0, 8, 0], 
//             [4, 7, 0, 5, 0, 0, 1, 0, 0],
//             [3, 8, 6, 0, 0, 2, 0, 0, 0],
//             [1, 6, 0, 0, 0, 0, 7, 0, 4],
//             [0, 0, 0, 0, 0, 4, 6, 0, 0],
//             [7, 0, 0, 0, 3, 0, 5, 0, 0],
//             [0, 9, 0, 0, 0, 0, 0, 4, 0],
//             [0, 0, 3, 7, 2, 0, 9, 0, 6],
//             [0, 0, 5, 0, 0, 6, 0, 7, 3]];
let arr2 = [ [5, 3, 0, 0, 7, 0, 0, 0, 0], 
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]];
// let a = g.generate_puzzle(30);
// console.table(a);
// let r = g.solve_board(a);
// console.table(r);
// let res = g.count_zeros(arr2);
// console.log(res);
res_m = g.generate_board();
console.table(res_m);