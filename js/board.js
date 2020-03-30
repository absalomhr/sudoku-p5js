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

    s.mousePressed = () => {
        let current_x = s.floor(s.mouseX / sqr_sz);
        let current_y = s.floor(s.mouseY / sqr_sz);
        if((current_x >= 0 && current_x <= 8) && (current_y >= 0 && current_y <= 8) && piece_m[current_y][current_x] === 0){
            if(user_piece != -1){
                puzzle_m[current_y][current_x] = user_piece;
                piece_placed = true;
            } else{
                puzzle_m[current_y][current_x] = 0;
            }
            s.clear();
            s.redraw();
        }
    }

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
                if (puzzle_m[i][j] != 0)
                    draw_number(puzzle_m[i][j], j, i, s.color(line_color));  
            }
        }
    }

    function generate_puzzle(){
        let arr = [[9, 5, 1, 4, 6, 7, 3, 8, 2], 
        [4, 7, 2, 5, 8, 3, 1, 6, 9],
        [3, 8, 6, 1, 9, 2, 4, 5, 7],
        [1, 6, 8, 2, 5, 9, 7, 3, 4],
        [5, 3, 9, 8, 7, 4, 6, 2, 1],
        [7, 2, 4, 6, 3, 1, 5, 9, 8],
        [6, 9, 7, 3, 1, 8, 2, 4, 5],
        [8, 4, 3, 7, 2, 5, 9, 1, 6],
        [2, 1, 5, 9, 4, 6, 8, 0, 0]];
        return arr;
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