import * as React from 'react';
import styles from './CustomCarousel.module.scss';
import { ICustomCarouselProps } from './ICustomCarouselProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ICarouselState } from './ICarouselState';
import spservices from '../../../spservices/spservices';
import * as microsoftTeams from '@microsoft/teams-js';
import { ICarouselImages } from './ICarouselmages';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as $ from 'jquery';
import { FontSizes, } from '@uifabric/fluent-theme/lib/fluent/FluentType';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import * as strings from 'CustomCarouselWebPartStrings';
import { DisplayMode } from '@microsoft/sp-core-library';
import { CommunicationColors } from '@uifabric/fluent-theme/lib/fluent/FluentColors';
import {
	Spinner,
	SpinnerSize,
	MessageBar,
	MessageBarType,
	Label,
	Icon,
	ImageFit,
	ImageCoverStyle,
	Image,
	ImageLoadState,
} from 'office-ui-fabric-react';

export default class CustomCarousel extends React.Component<ICustomCarouselProps, ICarouselState> {

  private spService: spservices = null;
  private _teamsContext: microsoftTeams.Context = null;

  public constructor(props: ICustomCarouselProps) {
		super(props);
		this.spService = new spservices(this.props.context);

		if (this.props.context.microsoftTeams) {
			this.props.context.microsoftTeams.getContext(context => {
				this._teamsContext = context;
				console.log('ctt', this._teamsContext.theme);
				this.setState({ teamsTheme: this._teamsContext.theme });
			});

		}

		this.state = {
			isLoading: false,
			errorMessage: '',
			hasError: false,
			teamsTheme: 'default',
			photoIndex: 0,
			carouselImages: [],
			loadingImage: true
		};
  }
  
	private onConfigure() {
		
		this.props.context.propertyPane.open();
  }
  
	private async loadPictures() {

		this.setState({ isLoading: true, hasError: false });
		const tenantUrl = `https://${location.host}`;
		let galleryImages: ICarouselImages[] = [];
		let carouselImages: React.ReactElement<HTMLElement>[] = [];
		var imgWid;
		var ingHei;
		var resSize;
		var resHigh = '550px';


		// if (window.innerWidth !== undefined && window.innerHeight !== undefined)
		// 	{
		// 		imgWid = (window.innerWidth );
		// 	} else {  
		// 		imgWid = document.documentElement.clientWidth;
		// }
		// //console.log(imgWid + " updated");


		// if (imgWid < 1601 && imgWid > 1450 )
		// {
		// 	resSize = '78vw';

		// } else if (imgWid <= 1450 && imgWid > 1248 )
		// {
		// 	resSize = '86vw';

		// } else if (imgWid <= 1248 && imgWid > 1000 )
		// {
		// 	resSize = '91vw';
		// } else if (imgWid <= 1248 && imgWid > 1000 )
		// {
		// 	resSize = '91vw';
		// }
		// else if (imgWid <= 1000 && imgWid > 800 )
		// {
		// 	resSize = '94vw';
		// }
		// else if (imgWid <= 800 && imgWid > 700 )
		// {
		// 	resSize = '93vw';
		// 	resHigh = '500px';
		// }
		//  else if (imgWid <= 700 && imgWid>= 600 )
		//  {
		// 	resSize = '92vw';
		// 	resHigh = '450px';
		//  }
		// // else if (imgWid <= 600 && imgWid >= 500 )
		// // {
		// // 	resSize = '90vw';
		// // }
		


		try {
			const images = await this.spService.getImages(this.props.siteUrl, this.props.list, this.props.numberImages);

			for (const image of images) {

				if (image.FileSystemObjectType == 1) continue; 
				const pURL = `${tenantUrl}/_api/v2.0/sharePoint:${image.File.ServerRelativeUrl}:/driveItem/thumbnails/0/large/content?preferNoRedirect=true `;
				const thumbnailUrl = `${tenantUrl}/_api/v2.0/sharePoint:${image.File.ServerRelativeUrl}:/driveItem/thumbnails/0/c240x240/content?preferNoRedirect=true `;

				let mediaType: string = '';
				switch (image.File_x0020_Type) {
					case 'jpg':
					case 'jpeg':
					case 'png':
					case 'tiff':
					case 'gif':
						mediaType = 'image';
						break;
					case 'mp4':
						mediaType = 'video';
						break;
					default:
						continue;
						break;
				}

				galleryImages.push(
					{
						imageUrl: pURL,
						mediaType: mediaType,
						serverRelativeUrl: image.File.ServerRelativeUrl,
						caption: image.Title ? image.Title : image.File.Name,
						description: image.Description ? image.Description : '',
						linkUrl: ''
					},
				);

				// Create Carousel Slide

				carouselImages = galleryImages.map((galleryImage, i) => {
					return (
						<div className='slideLoading' >
									
							{galleryImage.description !== "" ?
								<div >
									<a href={galleryImage.description} target="_blank">
                					<Image src={galleryImage.imageUrl}
										onLoadingStateChange={async (loadState: ImageLoadState) => {
											//console.log('imageload Status ' + i, loadState, galleryImage.imageUrl);
											if (loadState == ImageLoadState.loaded) {
												this.setState({ loadingImage: false });
											}
										}}
										//width={resSize}
										//height={resHigh}
										//className={styles.img}
										width={'100%'}
										height={'550px'}
										/>
									</a>
									<div style={{ background: 'rgba(0, 0, 0, 0.3)',/* overflow: 'hidden', */fontSize: FontSizes.size20, /*top: 0, transition: '.7s ease', textAlign: 'left',*/ width: '100%',bottom: '8px', height: '30px', position: 'absolute', color: '#ffffff', padding: '25px' }}>
                                        <h4  style={{  color: 'white', textAlign: 'center', position: 'absolute',bottom:'2px'}}>Click the image to read more....</h4>
                                    </div>
								</div>
								:
								<div >

									<Image src={galleryImage.imageUrl}
										onLoadingStateChange={async (loadState: ImageLoadState) => {
											//console.log('imageload Status ' + i, loadState, galleryImage.imageUrl);
											if (loadState == ImageLoadState.loaded) {
												this.setState({ loadingImage: false });
											}
										}}

										//imageFit={ImageFit.center}
										//maximizeFrame={true}
										//width={imgWid}
										width={'100%'}
										height={'550px'}
										//className={styles.img}
										
										
									/>
									
								</div>
							}
						</div>
					);
				}
				);

				this.setState({ carouselImages: carouselImages, isLoading: false });
			}
		} catch (error) {
			this.setState({ hasError: true, errorMessage: decodeURIComponent(error.message) });
		}
  }
  
  public async componentDidMount() {
		await this.loadPictures();
  }
  
	public async componentDidUpdate(prevProps: ICustomCarouselProps) {

		if (!this.props.list || !this.props.siteUrl) return;
		if (prevProps.list !== this.props.list || prevProps.numberImages !== this.props.numberImages) {

			await this.loadPictures();
		}
	}
  
	public render(): React.ReactElement<ICustomCarouselProps> {
		const sliderSettings = {
			dots: true,
			infinite: true,
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1,
			lazyLoad: 'progressive',
			autoplaySpeed: 3000,
			initialSlide: this.state.photoIndex,
			//arrows: true,
			draggable: true,
			adaptiveHeight: true,
			useCSS: true,
			useTransform: true,
		};

		return (
			<div className={styles.carousel}>
				<div>
				</div>
				{
					(!this.props.list) ?
						<Placeholder iconName='Edit'
							iconText={strings.WebpartConfigIconText}
							description={strings.WebpartConfigDescription}
							buttonLabel={strings.WebPartConfigButtonLabel}
							hideButton={this.props.displayMode === DisplayMode.Read}
							onConfigure={this.onConfigure.bind(this)} />
						:
						this.state.hasError ?
							<MessageBar messageBarType={MessageBarType.error}>
								{this.state.errorMessage}
							</MessageBar>
							:
							this.state.isLoading ?
								<Spinner size={SpinnerSize.large} label='loading images...' />
								:
								this.state.carouselImages.length == 0 ?
									<div style={{ width: '300px', margin: 'auto' }}>
										<Icon iconName="PhotoCollection"
											style={{ fontSize: '250px', color: '#d9d9d9' }} />
										<Label style={{ width: '250px', margin: 'auto', fontSize: FontSizes.size20 }}>No images in the library</Label>
									</div>
									:
									<div style={{ width: '100%', height: '100%' }}>
										<div className={styles.caption}id='size'>
										<h2 className={styles.capText} >WELCOME TO DCOG INTRANET SYSTEM</h2>
										</div>
										<div style={{ width: '100%',top:'0' }}>
											<Slider
												{...sliderSettings}
												autoplay={true}
												onReInit={() => {
													if (!this.state.loadingImage)
														$(".slideLoading").removeClass("slideLoading");
												}}>
												{
													this.state.carouselImages
												}
											</Slider>
										</div>
										{
											this.state.loadingImage &&
											<Spinner size={SpinnerSize.small} label={'Loading...'} style={{ verticalAlign: 'middle', right: '30%', top: 20, position: 'absolute', fontSize: FontSizes.size18, color: CommunicationColors.primary }}></Spinner>
										}
									</div>
				}
			</div>
		);
	}
}
