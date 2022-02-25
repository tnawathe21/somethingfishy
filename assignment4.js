import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Cube, Rounded_Closed_Cone, Closed_Cone, Cone_Tip, Textured_Phong, Subdivision_Sphere, Triangle} = defs

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
            cone: new Rounded_Closed_Cone(( 5, 10,  [[0,2],[0,1]] )),
            sphere: new Subdivision_Sphere(4),
            triangle: new Triangle(),
            cone_tip: new Closed_Cone( 4, 10, [[  0 ,.33 ], [ 0,1 ]] ),
            cave: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(2),
            cave_hole: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(4)
        }

        this.materials = {
            phong: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
            }),
            table_texture: new Material(new Textured_Phong(), {
                color: hex_color("#964B00"),
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/table.png", "LINEAR_MIPMAP_LINEAR")
            }),
            fishbowl_texture: new Material(new Textured_Phong(), {
                color: color(175, 223, 239, .75),
                ambient: 1, diffusivity: .5, specularity: 0.2
            }),
            water_texture: new Material(new defs.Phong_Shader(), {
                color: hex_color("#4BBAFF"),
                ambient: 0.7, diffusivity: 0, specularity: 0.2,
            }),
            seaweed_texture: new Material(new Textured_Phong(), {
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                color: hex_color("#18aa6c"),
            }),
            sand_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/sand.png", "LINEAR_MIPMAP_LINEAR")
            }),
            big_fish_texture: new Material(new Textured_Phong(), {
                color: hex_color("#00468b"),
                ambient: 1, diffusivity: 0.1, specularity: 0,
                texture: new Texture("assets/blue_fish_scales.png", "LINEAR_MIPMAP_LINEAR")
            }),        
            cave_texture: new Material(new Textured_Phong(), {
                color: hex_color("4c4c4c"),
                ambient: 1, diffusivity: 1, specularity: 1,
            }),
            cave_hole_texture: new Material(new defs.Phong_Shader(), {
                color: hex_color("000000"), 
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
            fish_features: new Material(new defs.Phong_Shader(), {
                color: hex_color("#000000"),
                ambient: 1, diffusivity: 0.1, specularity: 0.1,
            }),
        }

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
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

    draw_big_fish(context, program_state, bigfish_model) {
        let t = program_state.animation_time / 1000;
        let bigfish_tail_model = Mat4.identity().times(Mat4.translation(5.2*Math.sin(t/3)+1.5, 3, 1))
                    .times(Mat4.scale(1.5, .75, .75)).times(Mat4.rotation(-Math.PI/4, 0, 0, 1));
        this.shapes.triangle.draw(context, program_state, bigfish_model, this.materials.big_fish_texture);
        this.shapes.triangle.draw(context, program_state, bigfish_tail_model, this.materials.big_fish_texture);
    }

    draw_fish_right_facing(context, program_state, fish_model, material, x, y,z) {
        
        let t = program_state.animation_time / 1000;
        //fish
        this.shapes.sphere.draw(context, program_state, fish_model, material);

        //tails
        let middle_tail_model = Mat4.identity().times(Mat4.translation(x*Math.sin(t/3)+0.7, y, z))
                    .times(Mat4.scale(0.3, 0.06, 0.1));
        let upper_tail_model = Mat4.identity().times(Mat4.translation(x*Math.sin(t/3)+0.6, y+0.2, z)).times(Mat4.rotation(1, 0, 0, 1))
        .times(Mat4.scale(0.3, 0.06, 0.1));
        let lower_tail_model = Mat4.identity().times(Mat4.translation(x*Math.sin(t/3)+0.6, y-0.2, z)).times(Mat4.rotation(-1, 0, 0, 1))
        .times(Mat4.scale(0.3, 0.06, 0.1));

        this.shapes.sphere.draw(context, program_state, middle_tail_model, material);
        this.shapes.sphere.draw(context, program_state, upper_tail_model, material);
        this.shapes.sphere.draw(context, program_state, lower_tail_model, material);

        //fins
        let right_fin = Mat4.identity().times(Mat4.translation(x*Math.sin(t/3)-0.2, y-0.2, z+0.2)).times(Mat4.rotation(1, 0, 0, 1))
        .times(Mat4.scale(0.2, 0.06, 0.1));
        let left_fin = Mat4.identity().times(Mat4.translation(x*Math.sin(t/3)-0.2, y-0.2, z -0.2)).times(Mat4.rotation(1, 0, 0, 1))
        .times(Mat4.scale(0.2, 0.06, 0.1));

        this.shapes.sphere.draw(context, program_state, right_fin, material);
        this.shapes.sphere.draw(context, program_state, left_fin, material);

        //eye
        let white_eye = Mat4.identity().times(Mat4.translation((x*Math.sin(t/3))-0.2, y+0.04, z +0.2)).times(Mat4.rotation(1, 0, 0, 1))
        .times(Mat4.scale(0.08, 0.07, 0.1));
        this.shapes.sphere.draw(context, program_state, white_eye, this.materials.fish_features.override({color: hex_color("#FFFFFF")}));
        let pupil = Mat4.identity().times(Mat4.translation((x*Math.sin(t/3))-0.2, y+0.04, z+0.2)).times(Mat4.rotation(1, 0, 0, 1))
        .times(Mat4.scale(0.06, 0.06, 0.102));
        this.shapes.sphere.draw(context, program_state, pupil, this.materials.fish_features);

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

    display(context, program_state) {
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(0, 0, -12));
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        const light_position = vec4(10, 10, 10, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];

        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        let model_transform = Mat4.rotation(.4,1,0,0);
        
        if (t < 10) {
            this.draw_table(context, program_state, model_transform);

            let desired = Mat4.translation(0,-.5,t-12);
            program_state.set_camera(desired);

            // seaweed
            let seaweed_model = Mat4.identity().times(Mat4.translation(-.6, -.1, 1.1)).times(Mat4.scale(0.03, 0.05, 0.01));
            for (let i = 0; i < 4; i++) {
                seaweed_model = this.draw_seaweed(context, program_state, seaweed_model, hex_color("#5ec89b"), i);
            }
            //this.shapes.cone.draw(context, program_state, seaweed_model.times(Mat4.translation(0, 1, 0)), this.materials.seaweed_texture);

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
        
            // fishbowl fade
           if (t <= 9) {
                this.shapes.sphere.draw(context, program_state, model_transform.times(Mat4.scale(.9, .7, .7).times(Mat4.translation(0, 1.2, 1.5))), this.materials.fishbowl_texture);
           }
            if (t > 9) {
                let fishbowl_color = color(50, 50, 50, 1-1/12*t);
                this.shapes.sphere.draw(context, program_state, model_transform.times(Mat4.scale(.9, .7, .7).times(Mat4.translation(0, 1.2, 1.5))), this.materials.fishbowl_texture.override({color: fishbowl_color}));
           }
        }
       else {
            program_state.set_camera(Mat4.translation(0, 0, -12));
            
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

            //big fish
             let bigfish_model = Mat4.identity().times(Mat4.translation(5.2*Math.sin(t/3), 3, 1))
                     .times(Mat4.scale(3, 1.5, 1.5)).times(Mat4.rotation(-Math.PI/4, 0, 0, 1));
            this.draw_big_fish(context, program_state, bigfish_model);

            // water bubble
            // this.shapes.sphere.draw(context, program_state, model_transform.times(Mat4.scale(.1, .1, .1).times(Mat4.translation(7, 1, 2))), this.materials.fishbowl_texture);
            // this.shapes.sphere.draw(context, program_state, model_transform.times(Mat4.scale(.1, .1, .1).times(Mat4.translation(10, 1, 2))), this.materials.fishbowl_texture);
            // this.shapes.sphere.draw(context, program_state, model_transform.times(Mat4.scale(.1, .1, .1).times(Mat4.translation(8.5, 2.8, 2))), this.materials.fishbowl_texture);
            this.draw_bubble_group(context, program_state, Mat4.identity());
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < i; j++) {
                    this.draw_bubble_group(context, program_state, Mat4.identity().times(Mat4.translation(.2+.2*i, .2+.2*i, 0)).times(Mat4.rotation(0, .5, .5, 0)));
                }
            }

            // cave
            this.shapes.cave.draw(context, program_state, model_transform.times(Mat4.scale(2, 2, 2).times(Mat4.translation(3, -0.75, 0.2))), this.materials.cave_texture);
           // this.shapes.cave_hole.draw(context, program_state, model_transform.times(Mat4.translation(5, -0.75, 2)), this.materials.cave_hole_texture);

           //normal fish
           let fish_model =  Mat4.identity().times(Mat4.translation(5.2*Math.sin(t/3), -0.5, 2)).times(Mat4.scale(0.5, 0.3, 0.3));
           this.draw_fish_right_facing(context, program_state, fish_model, this.materials.fish_texture_pink, 5.2, -0.5,2);

            fish_model =  Mat4.identity().times(Mat4.translation(3*Math.sin(t/3), 2, 2)).times(Mat4.scale(0.5, 0.3, 0.3));
            this.draw_fish_right_facing(context, program_state, fish_model, this.materials.fish_texture_rainbow, 3, 2,2);

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

