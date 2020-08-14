import React from 'react';
import { Container, Row, Col, Jumbotron, Button} from 'react-bootstrap';
import parse from 'html-react-parser';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		  value: '',
		  htmlSize:0,
		  parsedHtml:'',
		};

		this.handleChange = this.handleChange.bind(this);	
		this.showPreview = this.showPreview.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}
	showPreview(html){
		this.setState({parsedHtml: parse(html), htmlSize:html.length});
	}
  render() {
	
	//regex replace function
	function replaceStringRegex(regex, replacement){
		return function(str){
			return str.replace(regex, replacement);
		}
	}
	//Regex to find the markdowns
	const anchorRegex = /\[([^\[]+)\]\(([^\)]+)\)/g;
	const headingsRegex = /\n(#+\s*)(.*)/g;
	const boldItalicsRegex = /(\*{1,2})(.*?)\1/g;
	const blockquoteRegex = /\n(&gt;|\>)(.*)/g;
	const hrRegex = /\n((\-{3,})|(={3,}))/g;
	const paraRegex = /\n+(?!<pre>)(?!<h)(?!<ul>)(?!<blockquote)(?!<hr)(?!\t)([^\n]+)\n/g;
	
	//Replacers to apply regex
	const headingReplacer = function(fullMatch, tagStart, tagContents){
		return '\n<h' + tagStart.trim().length + '>' + tagContents + '</h' + tagStart.trim().length + '>';
	}
	
	const boldItalicsReplacer = function(fullMatch, tagStart, tagContents){
		return '<' + ( (tagStart.trim().length===1)?('em'):('strong') ) + '>'+ tagContents + '</' + ( (tagStart.trim().length===1)?('em'):('strong') ) + '>';
	}
	
	const blockquoteReplacer = function(fullMatch, tagStart, tagContents){
		return '\n<blockquote>' + tagContents + '</blockquote>';
	}
	
	const horizontalRuleReplacer = function(fullMatch){
		return '\n<hr />';
	}
	
	const paragraphReplacer = function(fullMatch, tagContents){
		return '<p>' + tagContents + '</p>';
	}
	
	const linkReplacer = function(fullMatch, tagTitle, tagURL){
		return '<a href="' + tagURL + '">' + tagTitle + '</a>';
	}
	
	//order of functions to apply regex
	const replaceLinks = replaceStringRegex(anchorRegex, linkReplacer);
	const replaceHeadings = replaceStringRegex(headingsRegex, headingReplacer);
	const replaceBoldItalics = replaceStringRegex(boldItalicsRegex, boldItalicsReplacer);
	const replaceBlockquotes = replaceStringRegex(blockquoteRegex, blockquoteReplacer);
	const replaceHorizontalRules = replaceStringRegex(hrRegex, horizontalRuleReplacer);
	const replaceParagraphs = replaceStringRegex(paraRegex, paragraphReplacer);
	
	const replaceMarkdown = function(str) {
	  return replaceParagraphs(
			replaceHorizontalRules(replaceBlockquotes(
				replaceBoldItalics(replaceHeadings(replaceLinks(str)
		  ))))
		);
	}

	function convertMarkDownToHtml(str) {
		return replaceMarkdown('\n' + str + '\n').trim();
	}
	const html = convertMarkDownToHtml(this.state.value);
    return (
	<Container className="p-3" fluid="sm">
	<Row>
		<Col className="text-center">
			<h3>Markdown Convertor</h3>
		</Col>
	</Row>
    <Jumbotron>
	<Row>
		<Col>
		<h3>Markdown</h3>
            <textarea value={this.state.value} data-testid="markdown" onChange={this.handleChange} cols={40} rows={10} />
		</Col>
		<Col>
          <h3>HTML</h3>
          <div data-testid="convertedHtml">{html}</div>
		</Col>
	</Row>
	</Jumbotron>
	{this.state.value ? <Button className = "mb-4 mr-4" onClick={()=>this.showPreview(html)}>Preview Formatted HTML </Button>:''}
	{(this.state.htmlSize !== html.length && this.state.htmlSize !== 0) ? <Button className = "mb-4" onClick={()=>this.showPreview(html)}>Refresh</Button>:''}
	<br/>
	{this.state.parsedHtml ?
	<Jumbotron>
	<Row >
		<Col>
          <h3>Preview</h3>
          <div data-testid="parsedHtml">{this.state.parsedHtml}</div>
		</Col>
	</Row>
	</Jumbotron>
	:''}
	</Container>
    );
  }
}

export default App;