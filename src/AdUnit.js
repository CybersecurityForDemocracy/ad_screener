import React, { Component } from 'react'

export default class AdUnit extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            funding_entity: 'Funding Entity',
            url: 'https://3jbq2ynuxa-flywheel.netdna-ssl.com/wp-content/uploads/2017/05/Autopilot.png',
            spend: '0-99 USD',
            impressions: '1000-5000',
            ad_lib_url: 'https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&impression_search_field=has_impressions_lifetime&view_all_page_id=153080620724'
        }
    }
    rc
    render() {
        return (
            <div style={{background: '#ffffff' , width: '40%', margin: '.5em', padding: '.5em'}}>
                <h1>{this.state.funding_entity}</h1>
                <img src={this.state.url} style={{width: '80%'}}/>
                <p>Spend: {this.state.spend}</p>
                <p>Impressions: {this.state.impressions}</p>
                <a href={this.state.ad_lib_url}>Ad Library Link</a>
            </div>
        )
    }
}
