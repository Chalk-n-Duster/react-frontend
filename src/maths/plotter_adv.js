import React from "react";
import nerdamer from 'nerdamer'
import Plot from 'react-plotly.js';
import linspace from 'exact-linspace'
// import ReactDOM from "react-dom";
import * as d3 from 'd3';
class Plotter extends React.Component {

    constructor(props) {
        super(props);
        this.wrapper = React.createRef();
    }

    state = {
        is3D: false,
        data3D: []
    }

    componentDidMount() {
        const { explist } = this.props;
        for (var exp of explist) {
            var varlength = -1
            if (exp.expression !== undefined)
                varlength = nerdamer(exp.expression).variables().length
               var flag=false
            if ((exp.type === 'explicit' && varlength === 2) || (exp.type === 'implicit' && varlength === 3) || (exp.type === 'parametric' && exp.z !== undefined)
                || (exp.type === 'vector' && exp.vector.length === 3 && exp.vector[2] !== 0)) {
                    flag=true
                this.set3dData()
                break;
            }
        }
        if(!flag){
        try {
            if (!this.state.is3D) {
                var data = explist.map(exp => {
                    const { type } = exp;
                    if (type === 'explicit') {
                        const { expression } = exp;
                        var evaluated = nerdamer(expression)
                        var vars = evaluated.variables();
                        if (vars.length > 1)
                            throw new Error('Cannot graph function containing more than 1 variable');
                        var f = evaluated.buildFunction();
                        return {

                            // offset: [1, 2],
                            graphType: 'polyline',
                            fn: function (scope) {
                                // scope.x = Number
                                var x = scope.x;
                                return f(x);
                            }
                        }
                    }
                    else if (type === 'implicit') {
                        const { expression } = exp;
                        return {
                            fn: expression,
                            fnType: 'implicit'
                        }
                    }
                    else if (type === 'polar') {
                        const { expression } = exp;
                        var evaluated = nerdamer(expression)
                        var vars = evaluated.variables();
                        if (vars.length > 1)
                            throw new Error('Cannot graph function containing more than 1 variable');
                        var f = evaluated.buildFunction();
                        return {
                            fnType: 'polar',
                            // offset: [1, 2],
                            graphType: 'polyline',
                            fn: function (scope) {
                                // scope.x = Number
                                var t = scope.theta;
                                return f(t);
                            }
                        }
                    }
                    else if (type === 'parametric') {
                        const { x, y } = exp;
                        var xvars = nerdamer(x).variables();
                        var yvars = nerdamer(y).variables();
                        if (xvars.length !== 1 || yvars.length !== 1 || xvars[0] !== yvars[0])
                            throw new Error('Invalid parametric equation');

                        return {
                            fnType: 'parametric',
                            x: x,
                            y: y,
                            graphType: 'polyline'
                        }
                    }
                    else if (type === 'vector') {
                        const { vector, offset } = exp;
                        if (offset !== undefined)
                            return {
                                vector: vector,
                                offset: offset,
                                graphType: 'polyline',
                                fnType: 'vector'
                            }
                        else
                            return {
                                vector: vector,
                                graphType: 'polyline',
                                fnType: 'vector'
                            }
                    }
                    else {
                        throw new Error('Unidentified type!')
                    }

                })
                var functionPlot = require('function-plot')
                functionPlot({

                    target: this.wrapper.current,
                    xAxis: { domain: [-10, 10] },
                    grid: true,
                    data: data

                })
            }
            else {
                this.set3dData()
            }
        }
        catch (e) {
            console.log('Cannot graph expression</br>' + e.toString());
        }
    }
    }

    set3dData = () => {
        const { explist } = this.props;
        try {
            var data = explist.map((exp,idx) => {
                var { type, range } = exp;
                if (range === undefined)
                    range=[-50,50]
                var xr = linspace(range[0], range[1])
                if (type === 'explicit') {
                    const { expression } = exp;
                    var evaluated = nerdamer(expression)
                    var vars = evaluated.variables();
                    if (vars.length > 2)
                        throw new Error('Cannot graph function containing more than 2 variables');
                    var f = evaluated.buildFunction();

                    var z = [], x = [], y = []
                    for (var i of xr) {
                        var z_row = [], x_row = [], y_row = []
                        z.push(z_row)
                        x.push(x_row)
                        y.push(y_row)
                        for (var j of xr) {
                            x_row.push(i)
                            y_row.push(j)
                            z_row.push(f(i, j))
                        }
                    }

                    return {
                        z: z,
                        x: x,
                        y: y,
                        showScale: 'false',
                        type: 'surface'
                    }
                }
                else if (type === 'implicit') {
                    const { expression } = exp;
                    var evaluated = nerdamer(expression)
                    var vars = evaluated.variables();
                    if (vars.length > 3)
                        throw new Error('Cannot graph function containing more than 3 variables');
                    var f = evaluated.buildFunction();

                    var z = [], x = [], y = [], val = []
                    for (var i of xr) {
                        for (var j of xr) {
                            for (var k of xr) {
                                x.push(i)
                                y.push(j)
                                z.push(k)
                                val.push(f(i, j, k))
                            }
                        }
                    }

                    return {
                        z: z,
                        x: x,
                        y: y,
                        value: val,
                        showScale: 'false',
                        isomin: 2,
                        isomax: 6,
                        type: 'isosurface',
                        colorScale:idx
                    }

                }
                else if (type === 'parametric') {
                    const { x, y, z } = exp;
                    var xvars = nerdamer(x).variables();
                    var yvars = nerdamer(y).variables();
                    var zvars = nerdamer(z).variables();

                    if (xvars.length > 2 || yvars.length > 2 || zvars.length > 2)
                        throw new Error('Invalid parametric equation');
                    var fx, fy, fz

                    fx = nerdamer(x).buildFunction()
                    fy = nerdamer(y).buildFunction()
                    fz = nerdamer(z).buildFunction()
                    var zv = [], xv = [], yv = []
                    if (xvars.length === 2 || yvars.length === 2 || zvars.length === 2) {
                        for (var i of xr) {
                            for (var j of xr) {
                                xv.push(fx(i, j))
                                yv.push(fy(i, j))
                                zv.push(fz(i, j))
                            }
                        }
                    }
                    else {
                        for (var i of xr) {

                            xv.push(fx(i))
                            yv.push(fy(i))
                            zv.push(fz(i))
                        }
                    }
                    return {
                        z: zv,
                        x: xv,
                        y: yv,
                        showScale: 'false',
                        type: 'mesh3d'
                    }
                }
                else if (type === 'vector') {
                    var { vector,offset } = exp
                    var r = Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2)
                    var unit_vector = vector.map(i => i / r);
                    if(offset===undefined)
                    offset=[0,0,0]
                    return [{
                        type: 'scatter3d',
                        mode: 'lines',
                        x: [offset[0], vector[0]+offset[0]],
                        y: [offset[1], vector[1]+offset[1]],
                        z: [offset[2], vector[2]+offset[2]],
                        opacity: 1,
                        line: {
                            width: 6,
                            reversescale: false
                        }
                    },
                    {
                        type: "cone",
                        showScale: 'false',
                        x: [vector[0]+offset[0]], y: [vector[1]+offset[1]], z: [vector[2]+offset[2]],
                        u: [unit_vector[0]], v: [unit_vector[1]], w: [unit_vector[2]]
                    }
                    ]

                }
            })
            data=data.reduce((acc, val) => acc.concat(val), []);
        this.setState({ is3D: true, data3D: data })
        } catch (e) {
            console.log('Cannot graph expression 3D</br>' + e.toString());
        }
        
    }

    render() {
        // const { width, height } = this.props;
        return (
            this.state.is3D
                ? <Plot
                    data={this.state.data3D}
                    layout={{ width: 1000, height: 1000, title: this.props.expression }}
                />
                : <div ref={this.wrapper}>
                    <h3>{this.props.expression}</h3>

                </div>


        );
    }
}

export default Plotter