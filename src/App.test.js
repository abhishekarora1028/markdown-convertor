import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent,queryByTestId, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders correctly', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
	});
});
describe('Textarea exists', () => {
    it('valid input field', () => {
	  const html = render(<App />);
	  const textarea = html.getByTestId('markdown');
      expect(textarea).toBeTruthy();
    });
});
  
describe('Enter sample markdown #1 to the textarea', () => {
    it('test converted html', () => {
	  const html = render(<App />);
	  const textarea = html.getByTestId('markdown');
      fireEvent.change(textarea, { target: { value: "# Sample Document\nHello!\n\nThis is sample markdown for the [Mailchimp](https://www.mailchimp.com) homework assignment." } })
	  const convertedHtml = html.getByTestId('convertedHtml');
	  expect(convertedHtml).toHaveTextContent('<h1>Sample Document</h1><p>Hello!</p><p>This is sample markdown for the <a href="https://www.mailchimp.com">Mailchimp</a> homework assignment.</p>');
    });
});
describe('Enter sample markdown #2 to the textarea', () => {
    it('test converted html', () => {
	  const html = render(<App />);
	  const textarea = html.getByTestId('markdown');
      fireEvent.change(textarea, { target: { value: "# Header one\nHello there\n\nHow are you?\nWhat's going on?\n\n## Another Header\n\nThis is a paragraph [with an inline link](http://google.com). Neat, eh?\n\n## This is a header [with a link](http://yahoo.com)" } })
	  const convertedHtml = html.getByTestId('convertedHtml');
	  expect(convertedHtml).toHaveTextContent('<h1>Header one</h1><p>Hello there</p><p>How are you?</p>What\'s going on? <h2>Another Header</h2><p>This is a paragraph <a href="http://google.com">with an inline link</a>. Neat, eh?</p> <h2>This is a header <a href="http://yahoo.com">with a link</a></h2>');
    });
});