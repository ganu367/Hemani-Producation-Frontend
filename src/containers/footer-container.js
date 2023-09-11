import React from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components";
import { useGoToLink } from "../hooks";
import { acecomLogo } from "../constants";

export default function FooterContainer() {
    const goToLink = useGoToLink();

    return (
        <Footer>
            <Footer.Group>
                <Footer.Logo src={acecomLogo} />
                <Footer.BigText>Developed by Acecom Solutions</Footer.BigText>
            </Footer.Group>
            <Footer.Group>
                <Footer.Text>Contact: 9869317608</Footer.Text>
                <Footer.Text marginHorizontal>|</Footer.Text>
                <Footer.Text><Footer.Link onClick={() => goToLink("acecomsolutions.in")}>acecomsolutions.in</Footer.Link></Footer.Text>
            </Footer.Group>
        </Footer>
    );
}