import React from 'react';
import './App.css';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const NONE_PROBABILITIES = [
  0.01,
  0.03,
  0.05,
  0.07,
  0.09,
  0.11,
  0.13,
  0.15,
  0.17,
  0.19,
  0.21,
  0.23,
  0.25,
  0.27,
];

const BASIC_PROBABILITIES = [
  0.04,
  0.08,
  0.12,
  0.15,
  0.19,
  0.23,
  0.26,
  0.30,
  0.34,
  0.37,
  0.41,
  0.45,
  0.48,
  0.52,
];

const QUALITY_PROBABILITIES = [
  0.08,
  0.13,
  0.18,
  0.24,
  0.29,
  0.34,
  0.40,
  0.45,
  0.50,
  0.56,
  0.61,
  0.66,
  0.72,
  0.77,
];

const ALL_PROBABILITIES = [
  NONE_PROBABILITIES,
  BASIC_PROBABILITIES,
  QUALITY_PROBABILITIES,
];

class StardewCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crops: 10,
      level: 1,
      fertilizer: 1,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  binomial(n, k) {
    // source: https://www.w3resource.com/javascript-exercises/javascript-math-exercise-20.php
    var coeff = 1;
    for (var x = n-k+1; x <= n; x++) coeff *= x;
    for (x = 1; x <= k; x++) coeff /= x;
    return coeff;
  }

  formatLaTeXEquation() {
    let n = this.state.crops;
    let p = ALL_PROBABILITIES[this.state.fertilizer][this.state.level];
    return `\\sum_{x=5}^{${n}} \\binom{${n}}{x} ${p}^x * \\left(1 - ${p}\\right)^{\\left(${n} - x\\right)}`
  }

  calculateProbability() {
    // Equation: sum (p^x * ((1-p)^(n-x)) * (n choose x)), x=5 to n
    // source: me, I'm great: https://amy.dev/?page_id=318
    let n = this.state.crops;
    let p = ALL_PROBABILITIES[this.state.fertilizer][this.state.level];

    let pGold = 0;
    for (let x = 5; x <= n; x++) {
      let nChooseX = this.binomial(n, x);
      let pGoldX = Math.pow(p, x);
      let pNotGoldX = Math.pow(1 - p, n - x);

      pGold += nChooseX * pGoldX * pNotGoldX;
    }
    return (pGold * 100).toFixed(1);
  }

  render() {
    return (
      <div>
        <h1>How likely is it that you'll grow at least five golden crops?</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            How many crops did you plant?
            <br />
            <input type="text" name="crops" value={this.state.crops} onChange={this.handleChange} />
          </label>
          <br /><br />
          <label>
            What's your farming level?
            <br />
            <input type="text" name="level" value={this.state.level} onChange={this.handleChange} />
	  </label>
          <br /><br />
          <label>
            What fertilizer did you use?
            <br />
            <select name="fertilizer" value={this.state.fertilizer} onChange={this.handleChange}>
              <option value="0">None</option>
              <option value="1">Basic</option>
              <option value="2">Quality</option>
            </select>
	  </label>
        </form>
        <br /><br />

        <InlineMath math={`${this.formatLaTeXEquation()} = ${this.calculateProbability()}\\%`} />
      </div>
    );
  }
}

export default StardewCalculator;
