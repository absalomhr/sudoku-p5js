const bar_sketch = (s) => {
    let font;
    let pieces_array = [1, 2, 3, 4, 5, 6, 7 , 8, 9];

    s.preload = () => {
        font = s.loadFont("assets/Sen-Regular.ttf");
    }

    s.setup = () => {
        s.createCanvas(sqr_sz * 9, sqr_sz);
        s.noLoop();
    }

    s.draw = () => {
        draw_bar();
        draw_outline();
        draw_inner_lines();
        draw_pieces();
    }

    function draw_square(x, y, w, s_col, cor_rad=[], stroke_w=null, stroke_col=null){
        let radius = 5; // for rounding borders
        s.noStroke();
        s.fill(s_col);
        let tl = 0, tr = 0, br = 0, bl = 0;
        if(stroke_col && stroke_w){
            s.stroke(stroke_col);
            s.strokeWeight(stroke_w);
        }
        if(cor_rad.indexOf("tl") > -1)
            tl = radius;
        if(cor_rad.indexOf("tr") > -1)
            tr = radius;
        if(cor_rad.indexOf("br") > -1)
            br = radius;
        if(cor_rad.indexOf("bl") > -1)
            bl = radius;
        s.rect(x, y, w, w, tl, tr, br, bl);
    }

    function draw_bar(){
        let arr = [];
        for(let i = 0; i < 9; i++){
            draw_square(i * sqr_sz, 0, sqr_sz, s.color(board_bg_color_light));  
        }
    }

    function draw_outline(){
        let line_w = 0.15 * sqr_sz;
        // bot line
        draw_line(0, s.height, s.width, s.height, outline_color, line_w);
        // left line
        draw_line(0, 0, 0, s.width, outline_color, line_w);
        // right line
        draw_line(s.width, 0, s.width, s.width, outline_color, line_w);
        // top line
        draw_line(0, 0, s.width, 0, outline_color, line_w);
        
    }

    function draw_line(x1, y1, x2, y2, l_col="rgb(0,0,0)", stroke_w=1){
        s.stroke(s.color(l_col));
        s.strokeWeight(stroke_w);
        s.line(x1, y1, x2, y2);
    }


    function draw_inner_lines(){
        let line_w = 0.05 * sqr_sz;;
        for(let i = 1; i < 9; i++){
            draw_line(i * sqr_sz, 0, i * sqr_sz, s.width, line_color, line_w);
        }
    }

    function write_text(string, size, x, y, tcolor, font, stroke_w=0, stroke_col=null){
        s.noStroke();
        if(stroke_w != 0){
            s.stroke(stroke_col);
            s.strokeWeight(stroke_w);
        }
        s.textFont(font);
        s.textSize(size);
        s.textAlign(s.CENTER, s.CENTER);
        s.fill(tcolor);
        s.text(string, x, y);
    }

    function draw_number(n, x, y){
        let n_size = (2/3) * sqr_sz;
        let tcolor = s.color(focus_color);
        write_text(n, n_size, (x * sqr_sz) + (sqr_sz / 2), (y * sqr_sz) + (sqr_sz / 2.5), line_color, font);
    }

    function draw_pieces(){
        for(let i = 0; i < 9; i++){
            draw_number(pieces_array[i], i, 0);  
        }
    }

    function draw_flower(x, fcolor){
        s.fill(fcolor);
        s.ellipse((x * sqr_sz) + s.floor(sqr_sz / 2), s.floor(sqr_sz / 2), 6, 25);
        s.ellipse((x * sqr_sz) + s.floor(sqr_sz / 2), s.floor(sqr_sz / 2), 25, 6);
    }

    s.mousePressed = () => {
        let current_x = s.floor(s.mouseX / sqr_sz);
        let current_y = s.floor(s.mouseY / sqr_sz);
        if ((current_x >= 0 && current_x <= 8) && current_y === 0){
            if(user_piece === 0){
                user_piece = pieces_array[current_x];
            } else {
                let tempx = user_piece - 1;
                s.redraw();
                user_piece = pieces_array[current_x];
            }
            draw_flower(current_x, s.color(focus_color));
            draw_number(pieces_array[current_x], current_x, 0);
            // s.print(user_piece);
        } else if(piece_placed){
            s.redraw();
            user_piece = -1;
            piece_placed = false;
        }
    }
}