class Generator{
    constructor() {
        this.pieces = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }

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

    shuffle(array){
        let shuffled = [...array];
        let i = shuffled.length, j = 0, temp;
        while (i--) {
            j = Math.floor(Math.random() * (i+1));
            temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }
        return shuffled;
    }

    shift_array(arr, k){
        let res = [...arr];
        for(let i = 0; i < k; i++){
            res.push(res.shift());
        }
        return res;
    }
    
    // Returns a random integer number between min (inclusive) and max (exclusive)  
    randint(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    unsolve_puzzle(arr, n=35){
        let p = arr.map((a) => [...a]);
        while(this.count_zeros(p) < 81 - n){
            let randx = this.randint(0, 9);
            let randy = this.randint(0, 9);
            p[randy][randx] = 0;
        }
        return p;
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

    generate_puzzle(){
        let puzzle = this.zeros_matrix(9);
        // Shuffling cols
        let curr_row = this.shuffle(this.pieces);
        puzzle[0] = curr_row;
        for(let i = 1; i < 9; i++){
            let shift_amount;
            if(i % 3 === 0)
                shift_amount = 4;
            else
                shift_amount = 3;
            curr_row = this.shift_array(curr_row, shift_amount);
            puzzle[i] = curr_row;
        }
        // Shuffling rows
        for(let i = 0; i < 3; i++){
            let lower_bound = i * 3;
            let upper_bound = (i * 3) + 3;
            let index1, index2 = -1;
            while(true){
                index1 = this.randint(lower_bound, upper_bound);
                index2 = this.randint(lower_bound, upper_bound);
                if(index1 !== index2)
                    break;
            }
            let temp = puzzle[index1];
            puzzle[index1] = puzzle[index2];
            puzzle[index2] = temp;
        }
        let uns = this.unsolve_puzzle(puzzle);
        return [uns ,puzzle];
    }
}