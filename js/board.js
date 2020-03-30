const board_sketch = (s) => {
    let font;
    // Game functionality variables
    // The memory representation of the puzzle in the board
    let puzzle_m;
    // Matrix to keep track of which pieces are set by the puzzle generator
    // And which pieces are set by the user playing the game
    // This will help with coloring the pieces and restarting the current puzzle
    let piece_m;
    
    s.preload = () => {
        font = s.loadFont("assets/Sen-Regular.ttf");
    }

    s.setup = () => {
        s.createCanvas(sqr_sz * 9, sqr_sz * 9);
        s.noLoop();
        puzzle_m = generate_puzzle();
        piece_m = get_piece_matrix();
    }

    s.draw = () => {
        draw_board();
        draw_inner_lines();
        draw_outline();
        draw_pieces();
    }

    s.mousePressed = async () => {
        let curr_x = s.floor(s.mouseX / sqr_sz);
        let curr_y = s.floor(s.mouseY / sqr_sz);
        if((curr_x >= 0 && curr_x <= 8) && (curr_y >= 0 && curr_y <= 8)){
            if(piece_m[curr_y][curr_x] === 0){
                if(user_piece === -1){
                    puzzle_m[curr_y][curr_x] = 0;
                    piece_placed = true;
                    s.clear();
                    s.redraw();
                } else{
                    if(valid_move(curr_x, curr_y, user_piece)){
                        puzzle_m[curr_y][curr_x] = user_piece;
                        piece_placed = true;
                        s.clear();
                        s.redraw();
                        if(is_over()){
                            await new Promise(r => setTimeout(r, 10));
                            alert("You win!");
                        }
                    }
                }
                
            } else{
                valid_move(curr_x, curr_y, user_piece);
            }
        }
    }

    function which_area(x, y){
        let tempx, tempy;
        if (x >= 0 && x <= 2)
            tempx = 0
        else if (x >= 3 && x <= 5)
            tempx = 3
        else if (x >= 6 && x <= 8)
            tempx = 6
        if (y >= 0 && y <= 2)
            tempy = 0
        else if (y >= 3 && y <= 5)
            tempy = 3
        else if (y >= 6 && y <= 8)
            tempy = 6
        return [tempx, tempy];
    }

    function which_color_of_bg(tempx, tempy){
        let col;
        if(((tempx === 0 || tempx === 6) && (tempy === 0 || tempy === 6)) || (tempx === 3 && tempy === 3))
            col = s.color(board_bg_color_dark);
        else
            col = s.color(board_bg_color_light);
        return col;
    }

    function valid_move(x, y, n){
        let a;
        // By area
        if(piece_m[y][x] === -1){
            a = which_area(x, y);
            draw_error(x, y, which_color_of_bg(a[0], a[1]));
            // s.print("self");
            return false;
        } 
        let valid = true;
        // Vertical line
        for(let i = 0; i < 9; i++){
            if(puzzle_m[i][x] === n){
                if(i === y)
                    continue
                a = which_area(x, i);
                draw_error(x, i, which_color_of_bg(a[0], a[1]));
                // s.print("vertical", x, i);
                valid = false;
            }
        }
        // Horizontal line
        for(let i = 0; i < 9; i++){
            if(puzzle_m[y][i] === n){
                if(i === x)
                    continue
                a = which_area(i, y);
                draw_error(i, y, which_color_of_bg(a[0], a[1]));
                // s.print("horizontal", i, y);
                valid = false;
            }
        }
        a = which_area(x, y);
        for(let i = a[0]; i < a[0] + 3; i++){
            for(let j = a[1]; j < a[1] + 3; j++){
                if(puzzle_m[j][i] === n){
                    // s.print("areas", i, j);
                    let ar = which_area(i, j);
                    draw_error(i, j, which_color_of_bg(a[0], a[1]));
                    valid = false;
                }
            }
        }
        return valid;
    }

    async function draw_error(x, y, area_col){
        draw_square(x * sqr_sz, y * sqr_sz, sqr_sz, s.color(extra_color), null, 3, s.color(focus_color));
        let col;
        if(piece_m[y][x] === 0)
            col = s.color(user_piece_col);
        else
            col = s.color(line_color);
        draw_number(puzzle_m[y][x], x, y, col);

        await new Promise(r => setTimeout(r, 500));

        s.clear();
        s.redraw();
    }

    // s.keyPressed = () => { draw_error(0,0, null)}

    function write_text(string, size, x, y, tcolor, font, stroke_w=null, stroke_col=null){
        s.noStroke();
        if(stroke_w){
            s.strokeWeight(stroke_w);
            s.stroke(stroke_col);
        }
        s.textFont(font);
        s.textSize(size);
        s.textAlign(s.CENTER, s.CENTER);
        s.fill(tcolor);
        s.text(string, x, y);
    }

    function draw_number(n, x, y, tcolor){
        n_size = (2/3) * sqr_sz;
        write_text(n, n_size, (x * sqr_sz) + (sqr_sz / 2), (y * sqr_sz) + (sqr_sz / 2.5), tcolor, font);
    }

    function draw_pieces(){
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if (puzzle_m[i][j] != 0){
                    if(piece_m[i][j] != 0){
                        draw_number(puzzle_m[i][j], j, i, s.color(line_color));  
                    } else{
                        draw_number(puzzle_m[i][j], j, i, s.color(user_piece_col));  
                    }

                }
            }
        }
    }

    function is_over(){
        for(let i = 0; i < 9; i++)
            if(puzzle_m[i].includes(0))
                return false;
        return true;
    }

    function generate_puzzle(){

        return [[0, 0, 1, 0, 0, 0, 0, 8, 0], 
                [4, 7, 0, 5, 0, 0, 1, 0, 0],
                [3, 8, 6, 0, 0, 2, 0, 0, 0],
                [1, 6, 0, 0, 0, 0, 7, 0, 4],
                [0, 0, 0, 0, 0, 4, 6, 0, 0],
                [7, 0, 0, 0, 3, 0, 5, 0, 0],
                [0, 9, 0, 0, 0, 0, 0, 4, 0],
                [0, 0, 3, 7, 2, 0, 9, 0, 6],
                [0, 0, 5, 0, 0, 6, 0, 7, 3]]

        // let arr = [[9, 5, 1, 4, 6, 7, 3, 8, 2], 
        // [4, 7, 2, 5, 8, 3, 1, 6, 9],
        // [3, 8, 6, 1, 9, 2, 4, 5, 7],
        // [1, 6, 8, 2, 5, 9, 7, 3, 4],
        // [5, 3, 9, 8, 7, 4, 6, 2, 1],
        // [7, 2, 4, 6, 3, 1, 5, 9, 8],
        // [6, 9, 7, 3, 1, 8, 2, 4, 5],
        // [8, 4, 3, 7, 2, 5, 9, 1, 6],
        // [2, 1, 5, 9, 4, 6, 8, 0, 0]];
        // return arr;
    }

    function get_piece_matrix(){
        let arr = [];
        for(let i = 0; i < 9; i++){
            arr.push([]);
            for(let j = 0; j < 9; j++){
                // 0 if the value is set by the user
                // -1 if the value is set by the puzzle generator
                if(puzzle_m[i][j] === 0)
                    arr[i].push(0);
                else
                    arr[i].push(-1);
            }
        }
        return arr;
    }

    function draw_square(x, y, w, s_col, cor_rad=null, stroke_w=null, stroke_col=null){
        let radius = 10; // for rounding borders
        s.noStroke();
        s.fill(s_col);
        let tl = 0, tr = 0, br = 0, bl = 0;
        if(stroke_col && stroke_w){
            s.stroke(stroke_col);
            s.strokeWeight(stroke_w);
        } else if(cor_rad){
            if(cor_rad.indexOf("tl") > -1)
                tl = radius;
            else if(cor_rad.indexOf("tr") > -1)
                tr = radius;
            else if(cor_rad.indexOf("br") > -1)
                br = radius;
            else if(cor_rad.indexOf("bl") > -1)
                bl = radius;
        }
        s.rect(x, y, w, w, tl, tr, br, bl);
    }

    function draw_line(x1, y1, x2, y2, l_col="rgb(0,0,0)", stroke_w=1){
        s.stroke(s.color(l_col));
        s.strokeWeight(stroke_w);
        s.line(x1, y1, x2, y2);
    }

    function draw_board(){
        // The 9 areas of the board
        let col;
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if((i % 2 === 0 && j % 2=== 0) || (i === j))
                    col = board_bg_color_dark;
                else
                    col = board_bg_color_light;  
                draw_square(i * 3 * sqr_sz, j * 3 * sqr_sz, 3 * sqr_sz, col);
            }
        }
    }

    function draw_outline(){
        let line_w = 0.25 * sqr_sz;
        draw_line(0, 0, 0, s.width, outline_color, line_w);
        draw_line(s.width, 0, s.width, s.width, outline_color, line_w);
        draw_line(0, 0, s.width, 0, outline_color, line_w);
        draw_line(0, s.width, s.width, s.width, outline_color, line_w);
    }

    function draw_inner_lines(){
        let line_w;
        for(let i = 1; i < 9; i++){
            if (i === 3 || i === 6)
                line_w = 3 * line_w;
            else
                line_w = 0.05 * sqr_sz;;
            draw_line(i * sqr_sz, 0, i * sqr_sz, s.width, line_color, line_w);
            draw_line(0, i * sqr_sz, s.width, i * sqr_sz, line_color, line_w);
        }
    }

    // Assistant functions
    function print_matrix(m){
        console.table(m);
    }
}