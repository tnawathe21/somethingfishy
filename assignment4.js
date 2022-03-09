import {defs, tiny} from './examples/common.js';

import {Color_Phong_Shader, Shadow_Textured_Phong_Shader,
    Depth_Texture_Shader_2D, Buffered_Texture, LIGHT_DEPTH_TEX_SIZE} from './examples/shadow-demo-shaders.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Cube, Rounded_Closed_Cone, Closed_Cone, Cone_Tip, Fake_Bump_Map, Textured_Phong, Subdivision_Sphere, Triangle} = defs


// 2D shape, to display the texture buffer
const Square =
    class Square extends tiny.Vertex_Buffer {
        constructor() {
            super("position", "normal", "texture_coord");
            this.arrays.position = [
                vec3(0, 0, 0), vec3(1, 0, 0), vec3(0, 1, 0),
                vec3(1, 1, 0), vec3(1, 0, 0), vec3(0, 1, 0)
            ];
            this.arrays.normal = [
                vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1),
                vec3(0, 0, 1), vec3(0, 0, 1), vec3(0, 0, 1),
            ];
            this.arrays.texture_coord = [
                vec(0, 0), vec(1, 0), vec(0, 1),
                vec(1, 1), vec(1, 0), vec(0, 1)
            ]
        }
    }

export class Assignment4 extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        this.shapes = {
            cube: new Cube(),
            cone : new defs.Cone_Tip ( 2, 10,  [[0.5,0],[0.5,0]] ),
            sphere: new Subdivision_Sphere(4),
            triangle: new Triangle(),
            cave: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(2),
            cave_hole: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(4),
            square_2d: new Square(),
        }

        this.bubbles = false;
        this.bubble_time = 0;
        this.bubble_start = false;

        this.r1 = 0;
        this.r2 = 0;
        this.r3 = 0;

        this.feed_fish = false;
        this.particles_time = 3;
        this.particles_start = false;

        this.r_1 = 0;
        this.r_2 = 0;
        this.r_3 = 0;

        this.materials = {
            phong: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
            }),
            table_texture: new Material(new Textured_Phong(), {
                color: hex_color("#964B00"),
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/table.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            tabletop_texture: new Material(new Shadow_Textured_Phong_Shader(1), {
                color: color(.5, .5, .5, 1),
                ambient: .4, diffusivity: .5, specularity: .5,
                color_texture: new Texture("assets/table.jpg"),
                light_depth_texture: null
    
            }),
            floor: new Material(new Shadow_Textured_Phong_Shader(1), {
                color: color(1, 1, 1, 1), ambient: .3, diffusivity: 0.6, specularity: 0.4, smoothness: 64,
                color_texture: new Texture("assets/rug.jpg"),
                light_depth_texture: null
            }),
            wall: new Material(new Shadow_Textured_Phong_Shader(1), {
                color: color(1, 1, 1, 1), ambient: .3, diffusivity: 0.6, specularity: 0.4, smoothness: 64,
                color_texture: new Texture("assets/wall.jpg"),
                light_depth_texture: null
            }),
             // For the first pass
        pure: new Material(new Color_Phong_Shader(), {
        }),
        // For light source
        light_src: new Material(new defs.Phong_Shader(), {
            color: color(1, 1, 1, 1), ambient: 1, diffusivity: 0, specularity: 0
        }),
        // For depth texture display
        depth_tex:  new Material(new Depth_Texture_Shader_2D(), {
            color: color(0, 0, .0, 1),
            ambient: 1, diffusivity: 0, specularity: 0, texture: null
        }),
        bubbles_rainbow: new Material(new Textured_Phong(), {
            color: hex_color("#ADD8E6"),
            ambient: .7, diffusivity: .5, specularity: .1,
            texture: new Texture("assets/rainbow_fish.png", "LINEAR_MIPMAP_LINEAR")
        }),
        fishbowl_texture: new Material(new Shadow_Textured_Phong_Shader(1), {
            color: color(.5, .5, .5, 0.75),
            ambient: .4, diffusivity: .5, specularity: .5,
            color_texture: new Texture("assets/water.png"),
            light_depth_texture: null

        }),
            water_texture: new Material(new defs.Phong_Shader(), {
                color: hex_color("#4BBAFF"),
                ambient: 0.7, diffusivity: 0, specularity: 0.2,
            }),
            coral_texture: new Material(new Textured_Phong(), {
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                color: hex_color("#ff7a9e"),
                ambient: 1, diffusivity: 0.1, specularity: 0.5,
                color: hex_color("#000000"),
                // texture: new Texture("assets/coral.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            seaweed_texture: new Material(new Textured_Phong(), {
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                color: hex_color("#18aa6c"),
                texture: new Texture("assets/seaweed.jpeg", "LINEAR_MIPMAP_LINEAR")
            }),
            sand_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/sand.png", "LINEAR_MIPMAP_LINEAR")
            }),
            big_fish_texture: new Material(new Textured_Phong(), {
                color: hex_color("#00468b"),
                ambient: 0.6, diffusivity: 0.1, specularity: 0,
                texture: new Texture("assets/blue-fish-scales.jpeg", "LINEAR_MIPMAP_LINEAR")
            }), 
            big_fish_tail_texture: new Material(new Textured_Phong(), {
                color: hex_color("#00468b"),
                ambient: 0.5, diffusivity: 0.1, specularity: 0,
                texture: new Texture("assets/fish-tail.jpg", "LINEAR_MIPMAP_LINEAR")
            }),       
            cave_texture: new Material(new Textured_Phong(), {
                color: hex_color("#4c4c4c"),
                ambient: 0.3, diffusivity: 1, specularity: .4,
                texture: new Texture("assets/rock.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            body_part_texture: new Material(new defs.Phong_Shader(), {
                ambient: 1,
                color: hex_color("000000"), 
            }),
            crab_texture: new Material(new defs.Phong_Shader(), {
                color: hex_color("#e88472"), 
                ambient: 1, diffusivity: 1, specularity: 1,
            }),
            crab_dots_texture: new Material(new defs.Phong_Shader(), {
                color: hex_color("#e88472"), 
                ambient: 1, diffusivity: 1, specularity: 1,
                texture: new Texture("assets/crab-texture.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            fish_texture_orange: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/orange_fish.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            fish_texture_pink: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/pink_fish.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            fish_texture_rainbow: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/rainbow_fish.png", "LINEAR_MIPMAP_LINEAR")
            }),
            food_particles: new Material(new Textured_Phong(), {
                color: hex_color("#765424"),
                ambient: .4, diffusivity: 0.1, specularity: 0.1
            }),
            fish_features: new Material(new defs.Phong_Shader(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
            }),
        }

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
        this.move_horizontal = 0;
        this.move_vertical = 0;
        this.init_ok = false;
    }

    getRandomNum() {
        return Math.random();
    }

    draw_sand(context, program_state, sand_model, i, j) {
        sand_model = sand_model.times(Mat4.translation(i, j, 1));
        this.shapes.cube.draw(context, program_state, sand_model, this.materials.sand_texture);
    }

    draw_background(context, program_state, background_model, i, j) {
        background_model = background_model.times(Mat4.translation(i, j, 1));
        this.shapes.cube.draw(context, program_state, background_model, this.materials.water_texture);
    }

    draw_seaweed(context, program_state, seaweed_model, color, i) {
        let t = program_state.animation_time / 1000;
        let angle = 0.1 * Math.sin(t);
        if (i % 2 == 0) {
            angle *= -1;
        }
        seaweed_model = seaweed_model.times(Mat4.scale(10, 2, 10)).times(Mat4.translation(0, 1, 0)).times(Mat4.translation(-0.1, -0.5, 0))
                                        .times(Mat4.rotation(angle, 0, 0, 1)).times(Mat4.translation(0.1, 0.5, 0)).times(Mat4.scale(0.1, 0.5, 0.1));
        this.shapes.cube.draw(context, program_state, seaweed_model, this.materials.seaweed_texture.override({color:color}));
        return seaweed_model;
    }

    draw_coral(context, program_state) {
        let branch1_model = Mat4.identity().times(Mat4.translation(-5.5, -2.5, 1)).times(Mat4.rotation(0.5, 0, 0, 1))
                            .times(Mat4.scale(0.05, 0.4, 0.05));
        let branch2_model = branch1_model.times(Mat4.scale(10, 2, 10)).times(Mat4.translation(0, 1, 0)).times(Mat4.translation(-0.1, -0.5, 0))
                            .times(Mat4.rotation(-0.7, 0, 0, 1)).times(Mat4.translation(0.1, 0.5, 0)).times(Mat4.scale(0.1, 0.5, 0.1));
        let branch3_model = Mat4.identity().times(Mat4.translation(-5.4, -2, 1)).times(Mat4.rotation(0.1, 0, 0, 1))
                            .times(Mat4.scale(0.05, 0.8, 0.05));
        let branch4_model = branch3_model.times(Mat4.scale(10, 1, 10)).times(Mat4.translation(0, 1, 0)).times(Mat4.translation(-0.05, -0.5, 0))
                            .times(Mat4.rotation(0.5, 0, 0, 1)).times(Mat4.translation(0.25, 0.8, 0)).times(Mat4.scale(0.1, 0.5, 0.1));
        let branch5_model = branch3_model.times(Mat4.scale(10, 0.8, 10)).times(Mat4.translation(0, 1, 0)).times(Mat4.translation(-0.05, -0.5, 0))
                            .times(Mat4.rotation(-0.3, 0, 0, 1)).times(Mat4.translation(-0.1, 1, 0)).times(Mat4.scale(0.1, 0.5, 0.1));
        let branch6_model = Mat4.identity().times(Mat4.translation(-5.2, -2.4, 1)).times(Mat4.rotation(-0.2, 0, 0, 1))
                            .times(Mat4.scale(0.05, 0.5, 0.05));
        let branch7_model = branch6_model.times(Mat4.scale(10, 2, 10)).times(Mat4.translation(0, 1, 0)).times(Mat4.translation(-0.05, -0.5, 0))
                            .times(Mat4.rotation(-0.4, 0, 0, 1)).times(Mat4.translation(0.07, 0.5, 0)).times(Mat4.scale(0.1, 0.5, 0.1));
        let branch8_model = branch6_model.times(Mat4.scale(10, 1, 10)).times(Mat4.translation(0, 1, 0)).times(Mat4.translation(-0.05, -0.5, 0))
                            .times(Mat4.rotation(0.8, 0, 0, 1)).times(Mat4.translation(1, 1.2, 0)).times(Mat4.scale(0.1, 0.5, 0.1));
        let branch9_model = Mat4.identity().times(Mat4.translation(-5, -2.45, 1)).times(Mat4.rotation(-0.5, 0, 0, 1))
                            .times(Mat4.scale(0.05, 0.5, 0.05));

        this.shapes.cube.draw(context, program_state, branch1_model, this.materials.coral_texture);
        this.shapes.cube.draw(context, program_state, branch2_model, this.materials.coral_texture);
        this.shapes.cube.draw(context, program_state, branch3_model, this.materials.coral_texture);
        this.shapes.cube.draw(context, program_state, branch4_model, this.materials.coral_texture);
        this.shapes.cube.draw(context, program_state, branch5_model, this.materials.coral_texture);
        this.shapes.cube.draw(context, program_state, branch6_model, this.materials.coral_texture);
        this.shapes.cube.draw(context, program_state, branch7_model, this.materials.coral_texture);
        this.shapes.cube.draw(context, program_state, branch8_model, this.materials.coral_texture);
        this.shapes.cube.draw(context, program_state, branch9_model, this.materials.coral_texture);
    }

    draw_big_fish(context, program_state, x) {
        let t = program_state.animation_time / 1000;
        let tail_function = 0.15 * Math.cos(t);

        let upper_body_model = Mat4.identity().times(Mat4.translation(x, 3, 1)).times(Mat4.scale(1.2, 0.7, 0.6));
        let front_body_model = Mat4.identity().times(Mat4.translation(x - 1.58, 3, 1)).times(Mat4.rotation(tail_function, 0, 1, 0))
                                .times(Mat4.scale(1, 0.7, 0.7)).times(Mat4.rotation(-0.78, 0, 0, 1));
        let lower_body_model = Mat4.identity().times(Mat4.translation(x + 1.4, 3, 1)).times(Mat4.rotation(tail_function, 0, 1, 0))
                                .times(Mat4.scale(0.5, 0.4, 0.01));
        let upper_part_model = Mat4.identity().times(Mat4.translation(x + 1, 3.2, 1)).times(Mat4.rotation(-0.26, 0, 0, 0.01))
                                .times(Mat4.scale(0.7, 0.3, 0.05));
        let lower_part_model = Mat4.identity().times(Mat4.translation(x + 1, 2.8, 1)).times(Mat4.rotation(0.26, 0, 0, 0.01))
                                .times(Mat4.scale(0.7, 0.3, 0.05));
        
        let tail_model = Mat4.identity().times(Mat4.translation(x + 1.1, 3, 1)).times(Mat4.rotation(tail_function, 0, 1, 0))
                            .times(Mat4.scale(1.5, 1, 1)).times(Mat4.rotation(-0.78, 0, 0, 1));
               
        //eyes
        let eye_model = Mat4.identity().times(Mat4.translation(x - 0.6, 3, 2)) .times(Mat4.scale(.1, .1, .1));

        //eyebrow
        let eyebrow_model = Mat4.identity().times(Mat4.translation(x - 0.8, 3.1, 2.5)).times(Mat4.rotation(0.4, 0, 0, 1))
                            .times(Mat4.scale(.5, .1, .1));

        //side fin
        let fin_function = 0.3 * Math.cos(1.5 * t);
        
        let fin_model = Mat4.identity().times(Mat4.translation(x, 2.35, 2)).times(Mat4.rotation(fin_function, 0, 1, 0))
                    .times(Mat4.scale(1, .5, .5)).times(Mat4.rotation(-Math.PI/8, 0, 0, 1));

        this.shapes.sphere.draw(context, program_state, upper_body_model, this.materials.big_fish_texture);
        this.shapes.triangle.draw(context, program_state, front_body_model, this.materials.big_fish_texture);
        this.shapes.cube.draw(context, program_state, lower_body_model, this.materials.big_fish_tail_texture);
        this.shapes.cube.draw(context, program_state, upper_part_model, this.materials.big_fish_tail_texture);
        this.shapes.cube.draw(context, program_state, lower_part_model, this.materials.big_fish_tail_texture);
        this.shapes.triangle.draw(context, program_state, tail_model, this.materials.big_fish_tail_texture);
        this.shapes.sphere.draw(context, program_state, eye_model, this.materials.body_part_texture);
        this.shapes.triangle.draw(context, program_state, eyebrow_model, this.materials.body_part_texture)
        this.shapes.triangle.draw(context, program_state, fin_model, this.materials.big_fish_tail_texture);
    }

    draw_generic_fish(context, program_state, material, x, y, z, left) {
        let t = program_state.animation_time / 1000;
        let drawleftside = false;
        // fish animation starts at t = 10
        if (t >= 10 && t < 14) {
            this.move_vertical += 0.009*Math.sin(2*Math.PI*t/3);
            this.move_horizontal += 0.02;
            drawleftside = false;
        }
        if (t >= 14 && t <= 18) {
            this.move_vertical += 0.009*Math.sin(2*Math.PI*t/3);
            this.move_horizontal -= 0.02;
            drawleftside = true;
        }
        if (t >= 18 && t < 22) {
            this.move_horizontal += 0.005*Math.sin(2*Math.PI*t/3);
            this.move_vertical += 0.009*Math.sin(2*Math.PI*t/3);
            drawleftside = false;
        }
        if (t >= 22 && t < 25) {
            this.move_horizontal += 0.007*Math.sin(2*Math.PI*t/3);
            this.move_vertical -= 0.01;
            drawleftside = false;
        }
        if (t >= 25 && t < 26) {
            this.move_horizontal += 0.007*Math.sin(2*Math.PI*t/3);
            this.move_vertical -= 0.007*Math.sin(2*Math.PI*t/3);
            drawleftside = false;
        }
        if (t >= 26 && t < 30) {
            this.move_horizontal += 0.015;
            this.move_vertical -= 0.007*Math.sin(2*Math.PI*t/3);
            drawleftside = false;
        }
        if (t >= 30 && t <= 33) {
            this.move_vertical -= 0.007*Math.sin(2*Math.PI*t/3);
            drawleftside = false;
        }
        // TODO: ADD SCARY FACE TO CRAB AROUND 32 SECONDS
        // TODO: ADD SCARED FACE TO FISH AT 33 SECONDS
        if (t >= 33 && t < 34) {
            this.move_horizontal -= 0.1;
            this.move_vertical -= 0.01;
            drawleftside = true;
        }
        if (t >= 34 && t < 39) {
            this.move_vertical += 0.025*Math.sin(3*Math.PI*t);
            drawleftside = false;
        }
        if (t >= 39 && t < 42) {
            this.move_vertical += 0.015 + 0.007*Math.sin(3*Math.PI*t);
            this.move_horizontal += 0.02 + 0.003*Math.sin(3*Math.PI*t);
            drawleftside = false;
        }
        if (t >= 42 && t < 60) {
            // TODO: animate feeding the fish
            drawleftside = true;
        }
        if (t > 60) {

        }

        let fish_function = 0.1 * Math.cos(2 * t) + 0.5;   
        let tail_function = 0.5 * Math.cos(2 * t);
        let fin_function = 0.3 * Math.cos(1.5 * t);
        let upper_body_model = Mat4.identity().times(Mat4.translation(x + 0.3 + this.move_horizontal, fish_function + this.move_vertical, 2)).times(Mat4.scale(0.5, 0.3, 0.1));
        let lower_body_model = Mat4.identity().times(Mat4.translation(x + 0.8 + this.move_horizontal, fish_function + this.move_vertical, 2)).times(Mat4.rotation(0.7 * tail_function, 0, 1, 0))
                                .times(Mat4.scale(0.3, 0.15, 0.01));
        let upper_part_model = Mat4.identity().times(Mat4.translation(x + 0.7 + this.move_horizontal, fish_function + 0.1 + this.move_vertical, 2)).times(Mat4.rotation(-0.25, 0, 0, 0.01))
                                .times(Mat4.scale(0.2, 0.1, 0.05));
        let lower_part_model = Mat4.identity().times(Mat4.translation(x + 0.7 + this.move_horizontal, fish_function - 0.1 + this.move_vertical, 2)).times(Mat4.rotation(0.25, 0, 0, 0.01))
                                .times(Mat4.scale(0.2, 0.1, 0.05));

        // tail
        let tail_model = Mat4.identity().times(Mat4.translation(x + 0.95 + this.move_horizontal, y + this.move_vertical, z)).times(Mat4.rotation(tail_function, 0, 1, 0))
                            .times(Mat4.rotation(-0.8, 0, 0, 1)).times(Mat4.scale(0.5, 0.5, 0.01));

        // fins
        let left_fin_model = Mat4.identity().times(Mat4.translation(x + 0.3 + this.move_horizontal, y - 0.25 + this.move_vertical, z + 0.2)).times(Mat4.rotation(fin_function, 0, 1, 0))
                                .times(Mat4.scale(0.3, .2, .2)).times(Mat4.rotation(-0.4, 0, 0, 1));
        let right_fin_model = Mat4.identity().times(Mat4.translation(x + 0.3 + this.move_horizontal, y - 0.25 + this.move_vertical, z - 0.2)).times(Mat4.rotation(fin_function, 0, 1, 0))
                                .times(Mat4.scale(0.3, .2, .2)).times(Mat4.rotation(-0.4, 0, 0, 1));

        // eye
        let white_eye_model = Mat4.identity().times(Mat4.translation(x + 0.1 + this.move_horizontal, y + 0.04 + this.move_vertical, z + 0.2)).times(Mat4.scale(0.09, 0.09, 0.1));
        let pupil_model = Mat4.identity().times(Mat4.translation(x + 0.1 + this.move_horizontal, y + 0.04 + this.move_vertical, z + 0.2)).times(Mat4.scale(0.089, 0.089, 0.101));
        if (drawleftside !== true) {
            upper_body_model = Mat4.identity().times(Mat4.translation(x - 0.3 + this.move_horizontal, fish_function + this.move_vertical, 2)).times(Mat4.scale(0.5, 0.3, 0.1));
            lower_body_model = Mat4.identity().times(Mat4.translation(x - 0.8 + this.move_horizontal, fish_function + this.move_vertical, 2)).times(Mat4.rotation(0.7 * tail_function, 0, 1, 0))
                                    .times(Mat4.scale(0.3, 0.15, 0.01));
            upper_part_model = Mat4.identity().times(Mat4.translation(x - 0.7 + this.move_horizontal, fish_function + 0.1 + this.move_vertical, 2)).times(Mat4.rotation(0.25, 0, 0, 0.01))
                                    .times(Mat4.scale(0.2, 0.1, 0.05));
            lower_part_model = Mat4.identity().times(Mat4.translation(x - 0.7 + this.move_horizontal, fish_function - 0.1 + this.move_vertical, 2)).times(Mat4.rotation(-0.25, 0, 0, 0.01))
                                    .times(Mat4.scale(0.2, 0.1, 0.05));

            // tail
            tail_model = Mat4.identity().times(Mat4.translation(x - 0.95 + this.move_horizontal, y + this.move_vertical, z)).times(Mat4.rotation(tail_function, 0, 1, 0))
                                .times(Mat4.rotation(2.3, 0, 0, 1)).times(Mat4.scale(0.5, 0.5, 0.01));

            // fins
            left_fin_model = Mat4.identity().times(Mat4.translation(x - 0.3 + this.move_horizontal, y - 0.25 + this.move_vertical, z + 0.2)).times(Mat4.rotation(fin_function, 0, 1, 0))
                                    .times(Mat4.scale(0.3, .2, .2)).times(Mat4.rotation(8.2, 0, 0, 1));
            right_fin_model = Mat4.identity().times(Mat4.translation(x - 0.3 + this.move_horizontal, y - 0.25 + this.move_vertical, z - 0.2)).times(Mat4.rotation(fin_function, 0, 1, 0))
                                    .times(Mat4.scale(0.3, .2, .2)).times(Mat4.rotation(8.2, 0, 0, 1));

            // eye
            white_eye_model = Mat4.identity().times(Mat4.translation(x - 0.05 + this.move_horizontal, y + 0.04 + this.move_vertical, z + 0.2)).times(Mat4.scale(0.09, 0.09, 0.1));
            pupil_model = Mat4.identity().times(Mat4.translation(x - 0.05 + this.move_horizontal, y + 0.04 + this.move_vertical, z + 0.2)).times(Mat4.scale(0.089, 0.089, 0.101));
        }

        this.shapes.sphere.draw(context, program_state, upper_body_model, material);
        this.shapes.cube.draw(context, program_state, lower_body_model, material);
        this.shapes.cube.draw(context, program_state, upper_part_model, material);
        this.shapes.cube.draw(context, program_state, lower_part_model, material);
        this.shapes.triangle.draw(context, program_state, tail_model, material);
        this.shapes.triangle.draw(context, program_state, left_fin_model, material);
        this.shapes.triangle.draw(context, program_state, right_fin_model, material);
        this.shapes.sphere.draw(context, program_state, white_eye_model, this.materials.fish_features.override({color: hex_color("#FFFFFF")}));
        this.shapes.sphere.draw(context, program_state, pupil_model, this.materials.fish_features);
        
        // TODO: Fix this translation
        let initial_model = upper_body_model.times(Mat4.translation(-1.7, 0, 0)).times(Mat4.scale(1/.5, 1/.3, 1/.3));

        if (this.bubbles) {
            this.draw_bubble(context, program_state, initial_model, t);
        } 
        
        if (this.feed_fish) {
            this.draw_food_particles(context, program_state, initial_model);
        }
        /*let upper_tail_model = Mat4.identity().times(Mat4.translation(x+0.6, y+0.2, z)).times(Mat4.rotation(1, 0, 0, 1))
        .times(Mat4.scale(0.3, 0.06, 0.1));
        let lower_tail_model = Mat4.identity().times(Mat4.translation(x+0.6, y-0.2, z)).times(Mat4.rotation(-1, 0, 0, 1))
        .times(Mat4.scale(0.3, 0.06, 0.1));

        this.shapes.sphere.draw(context, program_state, middle_tail_model, material);
        this.shapes.sphere.draw(context, program_state, upper_tail_model, material);
        this.shapes.sphere.draw(context, program_state, lower_tail_model, material);*/

        //fins
        /*let right_fin = Mat4.identity().times(Mat4.translation(x-0.2, y-0.2, z+0.2)).times(Mat4.rotation(1, 0, 0, 1))
        .times(Mat4.scale(0.2, 0.06, 0.1));
        let left_fin = Mat4.identity().times(Mat4.translation(x-0.2, y-0.2, z -0.2)).times(Mat4.rotation(1, 0, 0, 1))
        .times(Mat4.scale(0.2, 0.06, 0.1));

        this.shapes.sphere.draw(context, program_state, right_fin, material);
        this.shapes.sphere.draw(context, program_state, left_fin, material);

        //eye
        let white_eye = Mat4.identity().times(Mat4.translation(x-0.2, y+0.04, z +0.2)).times(Mat4.rotation(1, 0, 0, 1))
        .times(Mat4.scale(0.08, 0.07, 0.1));
        this.shapes.sphere.draw(context, program_state, white_eye, this.materials.fish_features.override({color: hex_color("#FFFFFF")}));
        let pupil = Mat4.identity().times(Mat4.translation(x-0.2, y+0.04, z+0.2)).times(Mat4.rotation(1, 0, 0, 1))
        .times(Mat4.scale(0.06, 0.06, 0.102));
        this.shapes.sphere.draw(context, program_state, pupil, this.materials.fish_features);*/

    }

    draw_fish_inside_bowl(context, program_state, material, x, y, z, shadow_pass, draw_shadow=false, fish_transform) {
        let t = program_state.animation_time / 1000;

        let model_transform = Mat4.identity();
        if (fish_transform) {
            model_transform = fish_transform;
        }

        // body
        let fish_function = 0.1 * Math.cos(2 * t) + 0.5;
        let upper_body_model = model_transform.times(Mat4.translation(-2 - this.move, fish_function, 2)).times(Mat4.scale(0.5, 0.3, 0.1));
        let lower_body_model = model_transform.times(Mat4.translation(-1.5 - this.move, fish_function, 2)).times(Mat4.scale(0.3, 0.15, 0.01));
        let part1_model = model_transform.times(Mat4.translation(-1.6 - this.move, fish_function + 0.1, 2)).times(Mat4.rotation(-0.25, 0, 0, 0.01))
                                                .times(Mat4.scale(0.2, 0.1, 0.05));
        let part2_model = model_transform.times(Mat4.translation(-1.6 - this.move, fish_function - 0.1, 2)).times(Mat4.rotation(0.25, 0, 0, 0.01))
                                                .times(Mat4.scale(0.2, 0.1, 0.05));

        // tail
        let tail_function = 0.4 * Math.cos(2 * t);
        let tail_model = model_transform.times(Mat4.translation(x + 0.95 - this.move, y, z)).times(Mat4.rotation(tail_function, 0, 1, 0)).times(Mat4.rotation(-0.8, 0, 0, 1)).times(Mat4.scale(0.5, 0.5, 0.01));

        // fins
        let upper_fin_model =model_transform.times(Mat4.translation(x + 0.5 - this.move, y + 0.09, z + 0.2)).times(Mat4.rotation(1.2, 0, 0, 1))
                                                .times(Mat4.scale(0.3, 0.4, 0.1));

        // eye
        let white_eye_model = model_transform.times(Mat4.translation(x + 0.1 - this.move, y + 0.04, z + 0.2)).times(Mat4.rotation(1, 0, 0, 1))
                                                .times(Mat4.scale(0.09, 0.09, 0.1));
        
        let pupil_model = model_transform.times(Mat4.translation(x + 0.1 - this.move, y + 0.04, z + 0.2)).times(Mat4.rotation(1, 0, 0, 1))
                                            .times(Mat4.scale(0.088, 0.088, 0.101));

        if (t > 2 && t < 5) {
            this.move += 0.02;
        }

        this.shapes.sphere.draw(context, program_state, upper_body_model, material);
        this.shapes.cube.draw(context, program_state, lower_body_model, material);
        this.shapes.cube.draw(context, program_state, part1_model, material);
        this.shapes.cube.draw(context, program_state, part2_model,material);
        this.shapes.triangle.draw(context, program_state, tail_model, material);
        this.shapes.triangle.draw(context, program_state, upper_fin_model, material);
        this.shapes.sphere.draw(context, program_state, white_eye_model, this.materials.fish_features.override({color: hex_color("#FFFFFF")}));
        this.shapes.sphere.draw(context, program_state, pupil_model, this.materials.fish_features);
    }


    draw_crab(context, program_state) {
        let t = program_state.animation_time / 1000;
        let horiz_movement = Mat4.translation(.3*Math.sin(t/2)-0.26, 0, 0);

        let crab_transform = Mat4.identity().times(horiz_movement).times(Mat4.scale(.7, .5, .7).times(Mat4.translation(5, -3.7, 1)));
        this.shapes.sphere.draw(context, program_state, crab_transform, this.materials.crab_texture);

        //eyes
        let left_eye_stick = Mat4.identity().times(horiz_movement).times(Mat4.scale(.05, .2, .05).times(Mat4.translation(72, -6.8, 2.5)));
        this.shapes.sphere.draw(context, program_state, left_eye_stick, this.materials.crab_texture);

        let right_eye_stick = Mat4.identity().times(horiz_movement).times(Mat4.scale(.05, .2, .05).times(Mat4.translation(80, -6.8, 2.5)));
        this.shapes.sphere.draw(context, program_state, right_eye_stick, this.materials.crab_texture);

        let left_eyeball = Mat4.identity().times(horiz_movement).times(Mat4.scale(.12, .12, .12).times(Mat4.translation(29, -9, 2.5)));
        this.shapes.sphere.draw(context, program_state, left_eyeball, this.materials.body_part_texture);

        let right_eyeball = Mat4.identity().times(horiz_movement).times(Mat4.scale(.12, .12, .12).times(Mat4.translation(32.5, -9, 2.5)));
        this.shapes.sphere.draw(context, program_state, right_eyeball, this.materials.body_part_texture);

        //feet
        let left_foot = Mat4.identity().times(horiz_movement).times(Mat4.scale(.1, .2, .1).times(Mat4.translation(29.5, -10.5, 10)));
        this.shapes.sphere.draw(context, program_state, left_foot, this.materials.crab_texture);

        let right_foot = Mat4.identity().times(horiz_movement).times(Mat4.scale(.1, .2, .1).times(Mat4.translation(38, -10.75, 12)));
        this.shapes.sphere.draw(context, program_state, right_foot, this.materials.crab_texture);
        
        //left claw
        let left_claw_l = Mat4.identity().times(horiz_movement).times(Mat4.translation(0, Math.sin(2*t)/8 + 0.1, 0)).times(Mat4.scale(.13, .24, .13)
        .times(Mat4.translation(19.4, -7.25, 5))).times(Mat4.rotation(-Math.PI/6, 0, 0, 1));
        this.shapes.triangle.draw(context, program_state, left_claw_l, this.materials.crab_texture);

        let left_claw_r = Mat4.identity().times(horiz_movement).times(Mat4.translation(0, Math.sin(2*t)/8 + 0.1, 0)).times(Mat4.scale(.08, .36, .08)
        .times(Mat4.translation(33.5, -4.15, 9))).times(Mat4.rotation(-Math.PI/6, 0, 0, 1)).times(Mat4.rotation(6*Math.PI/4, 0, 0, 1));
        this.shapes.triangle.draw(context, program_state, left_claw_r, this.materials.crab_texture);

        //right claw
        let right_claw_l = Mat4.identity().times(horiz_movement).times(Mat4.translation(0, Math.cos(2*t)/8 + 0.01, 0)).times(Mat4.scale(.13, .23, .13)
                        .times(Mat4.translation(32.2, -7.6, 8))).times(Mat4.rotation(-Math.PI/6, 0, 0, 1));
        this.shapes.triangle.draw(context, program_state, right_claw_l, this.materials.crab_texture);

        let right_claw_r = Mat4.identity().times(horiz_movement).times(Mat4.translation(0, Math.cos(2*t)/8 + 0.01, 0)).times(Mat4.scale(.08, .35, .08)
                .times(Mat4.translation(54.1, -4.6, 14))).times(Mat4.rotation(-Math.PI/6, 0, 0, 1)).times(Mat4.rotation(6*Math.PI/4, 0, 0, 1));
        this.shapes.triangle.draw(context, program_state, right_claw_r, this.materials.crab_texture);

        //pincers
        let crab_pincer_left = Mat4.identity().times(horiz_movement).times(Mat4.translation(0, Math.sin(2*t)/8 + .1, 0))
                .times(Mat4.scale(.3, .1, .1).times(Mat4.translation(9.4, -18, 7)));
        this.shapes.sphere.draw(context, program_state, crab_pincer_left, this.materials.crab_texture);
        let crab_pincer_right = Mat4.identity().times(horiz_movement).times(Mat4.translation(0, Math.cos(2*t)/8 + 0.01, 0))
                .times(Mat4.scale(.25, .09, .09).times(Mat4.translation(16.5, -20.5, 12)));
        this.shapes.sphere.draw(context, program_state, crab_pincer_right, this.materials.crab_texture);
    }

    draw_table(context, program_state, model_transform) {
        this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.scale(2, 1/20, 2)), this.materials.table_texture);
        this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(-2,-1.1,1.8)).times(Mat4.scale(1/20, 1.1, 1/20)), this.materials.table_texture);
        this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(2,-1.1,1.8)).times(Mat4.scale(1/20, 1.1, 1/20)), this.materials.table_texture);            
        this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(2, -1.1,-1.8)).times(Mat4.scale(1/20, 1.1, 1/20)), this.materials.table_texture);
        this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(-2, -1.1,-1.8)).times(Mat4.scale(1/20, 1.1, 1/20)), this.materials.table_texture);
    }
    draw_bubble_group(context, program_state, bubble_model) {
        this.shapes.sphere.draw(context, program_state, bubble_model.times(Mat4.scale(.1, .1, .1).times(Mat4.translation(7, 1, 2))), this.materials.fishbowl_texture);
        this.shapes.sphere.draw(context, program_state, bubble_model.times(Mat4.scale(.1, .1, .1).times(Mat4.translation(10, 1, 2))), this.materials.fishbowl_texture);
        this.shapes.sphere.draw(context, program_state, bubble_model.times(Mat4.scale(.1, .1, .1).times(Mat4.translation(8.5, 2.8, 2))), this.materials.fishbowl_texture);
    }
    draw_bubble(context, program_state, initial_model) {
        let bubble_model = initial_model.times(Mat4.translation(0.5, this.bubble_time, 0)).times(Mat4.scale(.1,.1,.1));
        if (this.bubble_start) {
            this.r1 = this.getRandomNum();
            this.r2 = this.getRandomNum();
            this.r3 = this.getRandomNum();
        }
        this.bubble_start = false;

        this.shapes.sphere.draw(context, program_state, bubble_model.times(Mat4.translation(this.r1, .5*this.bubble_time, 0)), this.materials.bubbles_rainbow);
        this.shapes.sphere.draw(context, program_state, bubble_model.times(Mat4.translation(this.r2, this.bubble_time+.8, 0)), this.materials.bubbles_rainbow);
        this.shapes.sphere.draw(context, program_state, bubble_model.times(Mat4.translation(this.r3, 1.5*this.bubble_time+1.6, 0)), this.materials.bubbles_rainbow);
    }

    draw_food_particles(context, program_state, initial_model) {
        let particle_model = initial_model.times(Mat4.translation(0.5, this.particles_time, 0)).times(Mat4.scale(.1,.1,.1));
        if (this.feed_fish_start) {
            this.r_1 = this.getRandomNum();
            this.r_2 = this.getRandomNum();
            this.r_3 = this.getRandomNum();
        }
        this.feed_fish_start = false;

        if (this.particles_time > -2) {
            this.shapes.sphere.draw(context, program_state, particle_model.times(Mat4.translation(this.r_1-5, .5*this.particles_time, -5)), this.materials.food_particles);
            this.shapes.sphere.draw(context, program_state, particle_model.times(Mat4.translation(this.r_2-6, this.particles_time+.8, -5)), this.materials.food_particles);
            this.shapes.sphere.draw(context, program_state, particle_model.times(Mat4.translation(this.r_3-4, 1.5*this.particles_time+1.6, -5)), this.materials.food_particles);
            this.shapes.sphere.draw(context, program_state, particle_model.times(Mat4.translation(this.r_1-9, 2.5*this.particles_time+0.1, -5)), this.materials.food_particles);
            this.shapes.sphere.draw(context, program_state, particle_model.times(Mat4.translation(this.r_2-3, 3.5*this.particles_time+.8, -5)), this.materials.food_particles);
            this.shapes.sphere.draw(context, program_state, particle_model.times(Mat4.translation(this.r_3-6, 3*this.particles_time+1.6, -5)), this.materials.food_particles);
            this.shapes.sphere.draw(context, program_state, particle_model.times(Mat4.translation(this.r_1-11, 0.1*this.particles_time, -5)), this.materials.food_particles);
            this.shapes.sphere.draw(context, program_state, particle_model.times(Mat4.translation(this.r_2-17, 4.5*this.particles_time-.8, -5)),this.materials.food_particles);
            this.shapes.sphere.draw(context, program_state, particle_model.times(Mat4.translation(this.r_3-2, 7*this.particles_time+1.6, -5)), this.materials.food_particles);
            this.shapes.sphere.draw(context, program_state, particle_model.times(Mat4.translation(this.r_1-15, 2.5*this.particles_time, -5)), this.materials.food_particles);
            this.shapes.sphere.draw(context, program_state, particle_model.times(Mat4.translation(this.r_2-12, 4.5*this.particles_time+.8, -5)), this.materials.food_particles);
            this.shapes.sphere.draw(context, program_state, particle_model.times(Mat4.translation(this.r_3-8, 8*this.particles_time+1.6, -5)), this.materials.food_particles);
        }
    }

    make_control_panel() {
        this.key_triggered_button("Bubbles!", ["b"], () => {
            console.log("entered trigger");
            this.bubbles = !this.bubbles;
            this.bubble_time = 0;
            this.bubble_start = true;
        });
        this.key_triggered_button("Feed the fish! *when prompted*", ["f"], () => {
            this.feed_fish = !this.feed_fish;
            this.particles_time = 3;  
            this.particles_start = true;          
        });
    }

    texture_buffer_init(gl) {
        // Depth Texture
        this.lightDepthTexture = gl.createTexture();
        // Bind it to TinyGraphics
        this.light_depth_texture = new Buffered_Texture(this.lightDepthTexture);
        this.materials.tabletop_texture.light_depth_texture = this.light_depth_texture
        this.materials.floor.light_depth_texture = this.light_depth_texture

        this.lightDepthTextureSize = LIGHT_DEPTH_TEX_SIZE;
        gl.bindTexture(gl.TEXTURE_2D, this.lightDepthTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,      // target
            0,                  // mip level
            gl.DEPTH_COMPONENT, // internal format
            this.lightDepthTextureSize,   // width
            this.lightDepthTextureSize,   // height
            0,                  // border
            gl.DEPTH_COMPONENT, // format
            gl.UNSIGNED_INT,    // type
            null);              // data
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Depth Texture Buffer
        this.lightDepthFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.lightDepthFramebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,       // target
            gl.DEPTH_ATTACHMENT,  // attachment point
            gl.TEXTURE_2D,        // texture target
            this.lightDepthTexture,         // texture
            0);                   // mip level
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // create a color texture of the same size as the depth texture
        // see article why this is needed_
        this.unusedTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.unusedTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            this.lightDepthTextureSize,
            this.lightDepthTextureSize,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // attach it to the framebuffer
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,        // target
            gl.COLOR_ATTACHMENT0,  // attachment point
            gl.TEXTURE_2D,         // texture target
            this.unusedTexture,         // texture
            0);                    // mip level
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    render_table_scene(context, program_state, shadow_pass, draw_light_source=false, draw_shadow=false) {
        // shadow_pass: true if this is the second pass that draw the shadow.
        // draw_light_source: true if we want to draw the light source.
        // draw_shadow: true if we want to draw the shadow

        let light_position = this.light_position;
        let light_color = this.light_color;
        const t = program_state.animation_time;

        program_state.draw_shadow = draw_shadow;

        let model_transform = Mat4.rotation(.4,1,0,0);

        //walls
        let model_trans_floor = Mat4.rotation(0.4,1,0,0).times(Mat4.translation(0,-2.1,0)).times(Mat4.scale(8, 0.1, 5));
        let model_trans_wall_1 = Mat4.rotation(0.4,1,0,0).times(Mat4.translation(-8, 2 - 0.1, 0)).times(Mat4.scale(0.33, 4, 5));
        let model_trans_wall_2 = Mat4.rotation(0.4,1,0,0).times(Mat4.translation(+8, 2 - 0.1, 0)).times(Mat4.scale(0.33, 4, 5));
        let model_trans_wall_3 = Mat4.rotation(0.4,1,0,0).times(Mat4.translation(0, 2 - 0.1, -5)).times(Mat4.scale(8.3, 4, 0.33));
        this.shapes.cube.draw(context, program_state, model_trans_floor, shadow_pass? this.materials.floor : this.materials.pure);
        this.shapes.cube.draw(context, program_state, model_trans_wall_1, shadow_pass? this.materials.wall : this.materials.pure);
        this.shapes.cube.draw(context, program_state, model_trans_wall_2, shadow_pass? this.materials.wall : this.materials.pure);
        this.shapes.cube.draw(context, program_state, model_trans_wall_3, shadow_pass? this.materials.wall : this.materials.pure);

        //table
        this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.scale(2, 1/20, 2)), shadow_pass? this.materials.tabletop_texture : this.materials.pure);
        this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(-2,-1.1,1.8)).times(Mat4.scale(1/20, 1.1, 1/20)), shadow_pass? this.materials.table_texture : this.materials.pure);
        this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(2,-1.1,1.8)).times(Mat4.scale(1/20, 1.1, 1/20)), shadow_pass? this.materials.table_texture : this.materials.pure);            
        this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(2, -1.1,-1.8)).times(Mat4.scale(1/20, 1.1, 1/20)), shadow_pass? this.materials.table_texture : this.materials.pure);
        this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(-2, -1.1,-1.8)).times(Mat4.scale(1/20, 1.1, 1/20)), shadow_pass? this.materials.table_texture : this.materials.pure);

    }

    
    render_bowl(context, program_state, shadow_pass, draw_light_source=false, draw_shadow=false, fishbowl_color) {
        // shadow_pass: true if this is the second pass that draw the shadow.
        // draw_light_source: true if we want to draw the light source.
        // draw_shadow: true if we want to draw the shadow

        let light_position = this.light_position;
        let light_color = this.light_color;
        const t = program_state.animation_time;

        program_state.draw_shadow = draw_shadow;

        let model_transform = Mat4.rotation(.4,1,0,0);

        //bowl
        let bowl_transform = model_transform.times(Mat4.scale(.9, .7, .7).times(Mat4.translation(0, 1.2, 1.5)));
        this.shapes.sphere.draw(context, program_state, bowl_transform, shadow_pass? this.materials.fishbowl_texture : this.materials.pure);

    }

    display(context, program_state) {
        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        const gl = context.context;

        if (!this.init_ok) {
            const ext = gl.getExtension('WEBGL_depth_texture');
            if (!ext) {
                return alert('need WEBGL_depth_texture');  // eslint-disable-line
            }
            this.texture_buffer_init(gl);

            this.init_ok = true;
        }

        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(0, 0, -12));
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        const light_position = vec4(10, 10, 10, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        this.bubble_time += dt;
        this.particles_time -= dt/3;

        let model_transform = Mat4.rotation(.4,1,0,0);

        this.light_position = Mat4.translation(4, 3, 4, 0).times(vec4(3, 6, 0, 1));
        // The color of the light
        this.light_color = color(
            1,1,1,1
        );

        // This is a rough target of the light.
        // Although the light is point light, we need a target to set the POV of the light
        this.light_view_target = vec4(0, 0, 0, 1);
        this.light_field_of_view = 130 * Math.PI / 180; // 130 degree

        program_state.lights = [new Light(this.light_position, this.light_color, 1000)];

        // Step 1: set the perspective and camera to the POV of light
        const light_view_mat = Mat4.look_at(
            vec3(this.light_position[0], this.light_position[1], this.light_position[2]),
            vec3(this.light_view_target[0], this.light_view_target[1], this.light_view_target[2]),
            vec3(0, 2, 0), // assume the light to target will have a up dir of +y, maybe need to change according to your case
        );
       

        if (t < 10) { // fishbowl fade

        const light_proj_mat = Mat4.perspective(this.light_field_of_view, 1, 0.5, 500);
        // Bind the Depth Texture Buffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.lightDepthFramebuffer);
        gl.viewport(0, 0, this.lightDepthTextureSize, this.lightDepthTextureSize);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Prepare uniforms
        program_state.light_view_mat = light_view_mat;
        program_state.light_proj_mat = light_proj_mat;
        program_state.light_tex_mat = light_proj_mat;
        program_state.view_mat = light_view_mat;
        program_state.projection_transform = light_proj_mat;
        this.render_table_scene(context, program_state, false,false, false);
        this.render_bowl(context, program_state, false,false, false);
        
        let fish_function = 0.1 * Math.cos(2 * t) + 0.5;
        this.move = 0;
        let first_fish_transform = Mat4.identity().times(Mat4.translation(.6, 0, 1.1)).times(Mat4.scale(0.2, 0.2, 0.01));
        this.draw_fish_inside_bowl(context, program_state, this.materials.fish_texture_pink, -2.3, fish_function, 2, false, false, first_fish_transform);

        this.move = 0;
        let second_fish_transform = Mat4.identity().times(Mat4.translation(-0.1, 0.1, 1.1)).times(Mat4.scale(0.2, 0.2, 0.01));
        this.draw_fish_inside_bowl(context, program_state, this.materials.fish_texture_orange, -2.3, fish_function, 2, false, false, second_fish_transform);
        // Step 2: unbind, draw to the canvas
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        program_state.view_mat = program_state.camera_inverse;
        program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 0.5, 500);
        
        this.render_table_scene(context, program_state, true,true, true);
            let desired = Mat4.translation(0,-.5,t-12);
            program_state.set_camera(desired);

            // seaweed
            let seaweed_model = Mat4.identity().times(Mat4.translation(-.6, -.1, 1.1)).times(Mat4.scale(0.03, 0.05, 0.01));
            for (let i = 0; i < 4; i++) {
                seaweed_model = this.draw_seaweed(context, program_state, seaweed_model, hex_color("#5ec89b"), i);
            }

            seaweed_model = Mat4.identity().times(Mat4.translation(-.5, -.15, 1.1)).times(Mat4.scale(0.03, 0.05, 0.01));
            for (let i = 0; i < 6; i++) {
                seaweed_model = this.draw_seaweed(context, program_state, seaweed_model, hex_color("#18aa6c"), i);
            }

            seaweed_model = Mat4.identity().times(Mat4.translation(-.4, -.17, 1.1)).times(Mat4.scale(0.03, 0.05, 0.01));
            for (let i = 0; i < 7; i++) {
                seaweed_model = this.draw_seaweed(context, program_state, seaweed_model, hex_color("#18aa6c"), i);
            }

            seaweed_model = Mat4.identity().times(Mat4.translation(-.3, -.2, 1.1)).times(Mat4.scale(0.03, 0.05, 0.01));
            for (let i = 0; i < 8; i++) {
                seaweed_model = this.draw_seaweed(context, program_state, seaweed_model, hex_color("#5ec89b"), i);
            }

            seaweed_model = Mat4.identity().times(Mat4.translation(-.2, -.2, 1.1)).times(Mat4.scale(0.03, 0.05, 0.01));
            for (let i = 0; i < 5; i++) {
                seaweed_model = this.draw_seaweed(context, program_state, seaweed_model, hex_color("#5ec89b"), i);
            }
        
            //fish inside bowl
            this.move = 0;
            this.draw_fish_inside_bowl(context, program_state, this.materials.fish_texture_pink, -2.3, fish_function, 2, true, true, first_fish_transform);
            
            this.move = 0;
            this.draw_fish_inside_bowl(context, program_state, this.materials.fish_texture_orange, -2.3, fish_function, 2, false, false, second_fish_transform);
            
            // fishbowl fade
           if (t <= 9) {
            this.render_bowl(context, program_state, true,true, true);
           }
           if (t > 9) {
                let fishbowl_color = color(50, 50, 50, 1-1/12*t);
                this.shapes.sphere.draw(context, program_state, model_transform.times(Mat4.scale(.9, .7, .7).times(Mat4.translation(0, 1.2, 1.5))), this.materials.fishbowl_texture.override({color: fishbowl_color}));
           }
       }
        if (t >= 10 && t < 20) { // intro to the scene
            program_state.set_camera(Mat4.translation(0, 0, -12));
        }
        else if (t >= 20 && t < 25) { // fish swimming around
            program_state.set_camera(Mat4.translation(-4+.2*t, -4+.2*t, t-32));
            //background
        }
        else if (t >= 25 && t < 35) { // crab scene
            // if (t > 35) {
            //     t = 35;
            // }
            program_state.set_camera(Mat4.translation(5.8-.2*t, .8, -8));
        }

        else if (t >= 35) { // fish feeding -- zoom out
            let u = t;
            if (u > 38) {
                u = 38;
            }
            // start -1.2, .8, -8
            // end 0, 0, -12
            // in 3
            program_state.set_camera(Mat4.translation(-15.2+.4*u, 152/15-4/15*u, (13+1/3)-2/3*u));
            //background
        }

        if (t >= 9) {
            //background
            let background_model = Mat4.identity().times(Mat4.scale(1, 1, -0.5));
            for (let i = -17; i < 18; i++) {
                for (let j = -14; j < 10; j++) {
                    this.draw_background(context, program_state, background_model, i, j);
                }
            }

            // sand
            let sand_model = Mat4.identity().times(Mat4.scale(0.5, 0.5, 0.5));
            for (let i = -17; i < 18; i++) {
                for (let j = -9; j < -4; j++) {
                    this.draw_sand(context, program_state, sand_model, i, j);
                }
            }

            for (let i = -88; i < 88; i++) {
                let position = Math.sin(i / 8) - 20;
                sand_model = Mat4.identity().times(Mat4.scale(0.1, 0.1, 0.1));
                this.draw_sand(context, program_state, sand_model, i, position);
            }

            // seaweed
            let seaweed_model = Mat4.identity().times(Mat4.translation(-6, -3.4, 2)).times(Mat4.scale(0.15, 0.3, 0.01));
            for (let i = 0; i < 4; i++) {
                seaweed_model = this.draw_seaweed(context, program_state, seaweed_model, hex_color("#5ec89b"), i);
            }
            //this.shapes.cone.draw(context, program_state, seaweed_model.times(Mat4.translation(0, 1, 0)), this.materials.seaweed_texture);

            seaweed_model = Mat4.identity().times(Mat4.translation(-6.4, -3.4, 2)).times(Mat4.scale(0.15, 0.3, 0.01));
            for (let i = 0; i < 6; i++) {
                seaweed_model = this.draw_seaweed(context, program_state, seaweed_model, hex_color("#18aa6c"), i);
            }

            seaweed_model = Mat4.identity().times(Mat4.translation(-6.8, -3.4, 2)).times(Mat4.scale(0.15, 0.3, 0.01));
            for (let i = 0; i < 7; i++) {
                seaweed_model = this.draw_seaweed(context, program_state, seaweed_model, hex_color("#18aa6c"), i);
            }

            seaweed_model = Mat4.identity().times(Mat4.translation(-7.2, -3.4, 1)).times(Mat4.scale(0.15, 0.3, 0.01));
            for (let i = 0; i < 8; i++) {
                seaweed_model = this.draw_seaweed(context, program_state, seaweed_model, hex_color("#5ec89b"), i);
            }

            seaweed_model = Mat4.identity().times(Mat4.translation(-7.6, -3.4, 1)).times(Mat4.scale(0.15, 0.3, 0.01));
            for (let i = 0; i < 5; i++) {
                seaweed_model = this.draw_seaweed(context, program_state, seaweed_model, hex_color("#5ec89b"), i);
            }

            // seaweed next to cave
            seaweed_model = Mat4.identity().times(Mat4.translation(4.7, -3.4, 3)).times(Mat4.scale(0.1, 0.25, 0.007));
            for (let i = 0; i < 4; i++) {
                seaweed_model = this.draw_seaweed(context, program_state, seaweed_model, hex_color("#5ec89b"), i);
            }

            seaweed_model = Mat4.identity().times(Mat4.translation(4.5, -3.4, 3)).times(Mat4.scale(0.1, 0.25, 0.007));
            for (let i = 0; i < 6; i++) {
                seaweed_model = this.draw_seaweed(context, program_state, seaweed_model, hex_color("#18aa6c"), i);
            }

            seaweed_model = Mat4.identity().times(Mat4.translation(4.8, -3.4, 3)).times(Mat4.scale(0.1, 0.25, 0.007));
            for (let i = 0; i < 7; i++) {
                seaweed_model = this.draw_seaweed(context, program_state, seaweed_model, hex_color("#18aa6c"), i);
            }

            seaweed_model = Mat4.identity().times(Mat4.translation(5.3, -3.4, 3)).times(Mat4.scale(0.1, 0.25, 0.007));
            for (let i = 0; i < 8; i++) {
                seaweed_model = this.draw_seaweed(context, program_state, seaweed_model, hex_color("#5ec89b"), i);
            }

            seaweed_model = Mat4.identity().times(Mat4.translation(5.1, -3.4, 3)).times(Mat4.scale(0.1, 0.25, 0.007));
            for (let i = 0; i < 5; i++) {
                seaweed_model = this.draw_seaweed(context, program_state, seaweed_model, hex_color("#18aa6c"), i);
            }

            this.draw_big_fish(context, program_state, 3+2.2*Math.sin(t/3));
            this.draw_coral(context, program_state);
            this.shapes.cave.draw(context, program_state, model_transform.times(Mat4.scale(2, 2, 2).times(Mat4.translation(3, -0.75, 0.2))), this.materials.cave_texture);
            this.draw_crab(context, program_state);

           //generic fish 
           let fish_function = 0.1 * Math.cos(2 * t) + 0.5;
           this.draw_generic_fish(context, program_state, this.materials.fish_texture_orange, -2.3, fish_function, 2, true);
        }
    }
}

class Texture_Scroll_X extends Textured_Phong {
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            
            void main(){
                // Sample the texture image in the correct place:
                vec4 tex_color = texture2D( texture, f_tex_coord);
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}


class Texture_Rotate extends Textured_Phong {
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            void main(){
                // Sample the texture image in the correct place:
                vec4 tex_color = texture2D( texture, f_tex_coord );
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}

