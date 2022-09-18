/**
 * a annotation is a representation of a result 
 * that connects 2 or more pages in Casiopea
 * 
 */

class Annotation {
    constructor(o) {
        this.title = o.fulltext;
        this.url = o.fullurl;
        this.note = o.printouts.Nota[0];
        this.side = 10;
        this.over = false;
        this.myEdges = [];
        this.author = [];
        for (let i = 0; i < o.printouts.Autor.length; i++) {
          this.author.push(o.printouts.Autor[i].fulltext);
        }

        // crea el cuerpo físico de la observación
        let options = {
            friction: 0.5,
            frictionAir: 0.9,
            frictionStatic: 0.9,
            restitution: 0.9,
            sleepThreshold: 60,
            mass: this.w / 10
        };

        this.body = Bodies.rectangle(width / 2 + random(-2, 2), height / 2 + random(-2, 2), this.side, this.side, options);
        World.add(world, this.body);
        
        this.connectedNames = o.printouts["Páginas Relacionadas"];
        this.connected = [];

        for (let i = 0; i < this.connectedNames.length; i++) {
            let t = this.connectedNames[i].fulltext;
            for(let i = 0; i < caps.length; i++){
                if(caps[i].title === t){
                print("iguales!!");
                this.connected.push(caps[i]);

                // crea el vértice con los capítulos conectados
                let e = new Edge(this, caps[i], annotationEdges);
                this.myEdges.push(e);
                
                let edgeOptions = {
                    label: "spring",
                    length: 10,
                    stiffness: 0.31,
                    bodyA: this.body,
                    bodyB: caps[i].body
                }

                e.createLink(edgeOptions);
                }
            }
        }
    }

    display() {
        let pos = this.body.position;
        this.x = pos.x;
        this.y = pos.y;
        if (dist(this.x, this.y, mouseX, mouseY) < this.side / 2) {
            this.over = true;
            // for(e in this.myEdges){
            //     e.selected = true;
            // }
        } else {
            this.over = false;
            // for(e in this.myEdges){
            //     e.selected = false;
            // }
        }
        push();
        translate(pos.x, pos.y);
        if (this.over) {
            stroke(204, 37, 8);
            strokeWeight(3);
            fill(100);
        } else {
            stroke(0, 90);
            strokeWeight(.5);
            fill(230);
        }
        rectMode(CENTER);
        rect(0, 0, this.side, this.side);
        pop();
    }
}

function buildAnnotations() {
    // build main array 'obs'
    for (let key in obsData.query.results) {
        let result = obsData.query.results[key];
        console.log(result);
        let o = new Annotation(result);
        obs.push(o);
        print(result.fulltext);
    }
}

function drawAnnotations() {2
    for (n of obs) {
        n.display();
        if (mConstraint.body === n.body || n.over) {
            displayDetails(n);
            current = n;
        }
    }
}