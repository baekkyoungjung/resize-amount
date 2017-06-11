import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

export default class App extends Component {
	constructor(props) {
		super(props);

		[
			'html5FileHandling',
			'imgOnload',
		].forEach(method => (this[method] = this[method].bind(this)));
		this.state = {
			volume: 1000 * 1000,
		};
	}

	html5FileHandling(files) {
		const imgLoadModule = (file, i = 0) => {
			i += 1;
			const reader = new FileReader();
			reader.onload = event => {
				const img = new Image();
				img.onload = () => {
					this.imgOnload(img);
					if (i < files.length) {
						imgLoadModule(files[i], i);
					}
				}
				img.src = event.target.result;

			};
			reader.readAsDataURL(file);
		};
		imgLoadModule(files[0]);
	}

	imgOnload(img, resizeRatio = 1, repeatCount = 0) {
		const uniqueKey = `canvas-${$.now()}`;
		$('#edit-canvas').append(`<canvas id=${uniqueKey} />`);
		const editCanvas = $(`#${uniqueKey}`)[0];
		const ctx = editCanvas.getContext('2d');
		const newWidth = editCanvas.width = img.width * resizeRatio;
		const newHeight = editCanvas.height = img.height * resizeRatio;
		ctx.drawImage(img, 0, 0, newWidth, newHeight);
		const imageDataUrl = editCanvas.toDataURL("image/jpeg");
		const fileSizeExpect = Math.round(imageDataUrl.length * 3 / 4);
		const defaultVolume = this.state.volume * $('#input-volume').val();
		if (fileSizeExpect > defaultVolume) {
		// if ((fileSizeExpect > (this.state.volume * seletedVolume)) && (fileSizeExpect - (this.state.volume * seletedVolume))) {
			const calcRatio = (1 - (defaultVolume / fileSizeExpect)) / 2.5;
			if (repeatCount > 5) {
				$('#resize-img > .row').append(`
					<div class="col-xs-4">
						<img class="output-img img-responsive" alt="Image" src=${imageDataUrl} />
						<div class="overlay-filesize text-center">${fileSizeExpect / 1000000}메가</div>
					</div>
				`);
			} else {
				$(editCanvas).remove();
				this.imgOnload(img, resizeRatio - (calcRatio), repeatCount += 1);
			}
		} else {
			$('#resize-img > .row').append(`
				<div class="col-xs-4">
					<img class="output-img img-responsive" alt="Image" src=${imageDataUrl} />
					<div class="overlay-filesize text-center">${fileSizeExpect / 1000000}메가</div>
				</div>
			`);
		}
	}

	render() {
		return (
			<div className="container">
				<header>
					<h1>용량 리싸이즈</h1>
				</header>
				<Dropzone
					multiple
					className="list-group-item list-group-dropzone"
					activeClassName="block-dropzone-active"
					accept="image/*"
					ref={c => { this['img-dropzone'] = c; }}
					onDrop={this.html5FileHandling}
					style={{ textAlign: 'center' }}
				>
					<span className="lnr lnr-plus-circle" />
					{'aoentuhnoe'}
				</Dropzone>
				<select
					name="volume"
					id="input-volume"
					className="form-control"
					required="required">
					<option value="0.5">0.5</option>
					<option value="1">1</option>
					<option value="2">2</option>
				</select>
				<div id="edit-canvas" style={{ display: 'none' }}/>

				<div id="resize-img">
					<div className="row" />
				</div>
			</div>
		);
	}
}