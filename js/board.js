const board_sketch = (s) => {
    // Colors used in the design of the board
    const board_bg_color_dark = "rgb(152,72,61)";
    const board_bg_color_light = "rgb(222, 198, 148)";
    const outline_color = "rgb(85,43,38)";
    const line_color = "rgb(13, 12, 12)";
    const extra_color = "rgb(156, 108, 153)";
    const focus_color = "rgb(172, 243, 157)";
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
    }

    s.draw = () => {
        draw_board();
        draw_inner_lines();
        draw_outline();
        puzzle_m = generate_puzzle();
        piece_m = get_piece_matrix();
        draw_pices();
    }

    s.mousePressed = () => {
        console.log("wtf");
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

    function draw_number(n, x, y){
        n_size = (2/3) * sqr_sz;
        tcolor = s.color(focus_color);
        write_text(n, n_size, (x * sqr_sz) + (sqr_sz / 2), (y * sqr_sz) + (sqr_sz / 2.5), tcolor, font);
    }

    function draw_pices(){
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                draw_number(puzzle_m[i][j], j, i);  
            }
        }
    }

    function generate_puzzle(){
        return [[9, 5, 1, 4, 6, 7, 3, 8, 2], 
        [4, 7, 2, 5, 8, 3, 1, 6, 9],
        [3, 8, 6, 1, 9, 2, 4, 5, 7],
        [1, 6, 8, 2, 5, 9, 7, 3, 4],
        [5, 3, 9, 8, 7, 4, 6, 2, 1],
        [7, 2, 4, 6, 3, 1, 5, 9, 8],
        [6, 9, 7, 3, 1, 8, 2, 4, 5],
        [8, 4, 3, 7, 2, 5, 9, 1, 6],
        [2, 1, 5, 9, 4, 6, 8, 0, 0]]  
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

    function draw_square(x, y, w, f_col, cor_rad=null, stroke_w=null, stroke_col=null){
        s.noStroke();
        s.fill(f_col);
        let tl = 0, tr = 0, br = 0, bl = 0;
        if(stroke_col && stroke_w){
            s.stroke(stroke_col);
            s.strokeWeight(stroke_w);
        } else if(cor_rad){
            if(cor_rad === "tl")
                tl = 5;
            else if(cor_rad === "tr")
                tr = 5;
            else if(cor_rad === "br")
                br = 5;
            else if(cor_rad === "bl")
                bl = 5;
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
                draw_square(i * 3 * sqr_sz, j * 3 * sqr_sz, 3 * sqr_sz, col, 5);
            }
        }
    }

    function draw_outline(){
        let line_w = 0.2 * sqr_sz;
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