const carCanvas = document.getElementById("carCanvas")
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas")
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);

n = 100; 
const cars = generateCars(n);
let bestCar = cars[0];
if (localStorage.getItem("bestNN")){
    for (let i = 0; i < cars.length; i++){
        cars[i].nn = JSON.parse(localStorage.getItem("bestNN"));
        if (i != 0){
            NeuralNetwork.mutate(cars[i].nn, 0.1)
        }
    }
}
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
];

animate();

function save(){
    localStorage.setItem("bestNN", JSON.stringify(bestCar.nn));
}

function discard(){
    localStorage.removeItem("bestNN")
}

function generateCars(n){
    const cars = [];
    for (let i = 0; i < n; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function animate(time){
    for (let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders, []);
    }
    for (let i = 0; i < cars.length; i++){
        cars[i].update(road.borders, traffic);
    }
    bestCar = cars.find(c => c.y == Math.min(...cars.map(c=>c.y)));
    //car.update(road.borders, traffic);
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height*0.7);
    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++){
        traffic[i].draw(carCtx, "green");
    }
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++){
        cars[i].draw(carCtx, "black");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "black", true);
    carCtx.restore();

    networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx, bestCar.nn);
    requestAnimationFrame(animate);
}