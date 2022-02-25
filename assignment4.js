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
                color: hex_color("#4c4c4c"),
                ambient: 1, diffusivity: 1, specularity: 1,
            }),
            cave_hole_texture: new Material(new defs.Phong_Shader(), {
                color: hex_color("000000"), 
            }),
            crab_texture: new Material(new defs.Phong_Shader(), {
                color: color(255, 209, 193, 1), 
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

    draw_big_fish(context, program_state, bigfish_model, t) {
        // let t = program_state.animation_time / 1000;
        let bigfish_tail_model = Mat4.identity().times(Mat4.translation(5.2*Math.sin(t/3)+1.5, 3, 1))
                    .times(Mat4.scale(1.5, .75, .75)).times(Mat4.rotation(-Math.PI/4, 0, 0, 1));
                    
        let eye_model = Mat4.identity().times(Mat4.translation(5.2*Math.sin(t/3)+.7, 3.1, 1.2)) .times(Mat4.scale(.1, .1, .1));
        this.shapes.sphere.draw(context, program_state, eye_model, this.materials.cave_hole_texture);

        let eyebrow_model = Mat4.identity().times(Mat4.translation(5.2*Math.sin(t/3)+.5, 3.3, 1.3)) .times(Mat4.scale(.5, .1, .1))
                            .times(Mat4.rotation(-5*Math.PI/11, 0, 0, 1));
        this.shapes.triangle.draw(context, program_state, eyebrow_model, this.materials.cave_hole_texture);

        let mouth_model = Mat4.identity().times(Mat4.translation(5.2*Math.sin(t/3)+0.95, 2.5, 1.3)) .times(Mat4.scale(.4, .4, .4))
                            .times(Mat4.rotation(3*Math.PI/8, 0, 0, 1));
        this.shapes.triangle.draw(context, program_state, mouth_model, this.materials.cave_hole_texture);

        this.shapes.triangle.draw(context, program_state, bigfish_model, this.materials.big_fish_texture);
        this.shapes.triangle.draw(context, program_state, bigfish_tail_model, this.materials.big_fish_texture);
    }

    draw_crab(context, program_state, crab_model) {
        this.shapes.sphere.draw(context, program_state, crab_model, this.materials.crab_texture);

        let crab_pincer_left = Mat4.identity().times(Mat4.scale(.3, .1, .1).times(Mat4.translation(9.5, -20, 2.5)))
        this.shapes.cube.draw(context, program_state, crab_pincer_left, this.materials.crab_texture);
        let crab_pincer_right = Mat4.identity().times(Mat4.scale(.2, .075, .075).times(Mat4.translation(21, -25, 20)))
        this.shapes.cube.draw(context, program_state, crab_pincer_right, this.materials.crab_texture);
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
    
        if (t < 10) { // fishbowl fade
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

        if (t >= 10) {
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

            //big fish
             let bigfish_model = Mat4.identity().times(Mat4.translation(5.2*Math.sin(t/3), 3, 1))
                     .times(Mat4.scale(3, 1.5, 1.5)).times(Mat4.rotation(-Math.PI/4, 0, 0, 1));
            // let bigfish_model = Mat4.identity().times(Mat4.rotation(Math.PI*t/50, 0, 1, 0)).times(Mat4.translation(5.2*Math.sin(t/6), 0, 5.2*Math.cos(t/6)))
            //                 .times(Mat4.scale(3, 1.5, 1.5)).times(Mat4.rotation(-Math.PI/4, 0, 0, 1));
            this.draw_big_fish(context, program_state, bigfish_model, t);
            // water bubble
            // this.shapes.sphere.draw(context, program_state, model_transform.times(Mat4.scale(.1, .1, .1).times(Mat4.translation(7, 1, 2))), this.materials.fishbowl_texture);
            // this.shapes.sphere.draw(context, program_state, model_transform.times(Mat4.scale(.1, .1, .1).times(Mat4.translation(10, 1, 2))), this.materials.fishbowl_texture);
            // this.shapes.sphere.draw(context, program_state, model_transform.times(Mat4.scale(.1, .1, .1).times(Mat4.translation(8.5, 2.8, 2))), this.materials.fishbowl_texture);
            // this.draw_bubble_group(context, program_state, Mat4.identity());
            // for (let i = 0; i < 5; i++) {
            //     for (let j = 0; j < i; j++) {
            //         this.draw_bubble_group(context, program_state, Mat4.identity().times(Mat4.translation(.2+.2*i, .2+.2*i, 0)).times(Mat4.rotation(0, .5, .5, 0)));
            //     }
            // }

            // cave
            this.shapes.cave.draw(context, program_state, model_transform.times(Mat4.scale(2, 2, 2).times(Mat4.translation(3, -0.75, 0.2))), this.materials.cave_texture);
           // this.shapes.cave_hole.draw(context, program_state, model_transform.times(Mat4.translation(5, -0.75, 2)), this.materials.cave_hole_texture);

           let crab_transform = model_transform.times(Mat4.scale(.7, .7, .7).times(Mat4.translation(5, -2, 2.5)));
           this.draw_crab(context, program_state, crab_transform);
        //}
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

