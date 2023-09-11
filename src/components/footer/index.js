import React from 'react';
import { Container, Group, Logo, BigText, Text, Link } from './styles/footer';

function Footer({children, ...restProps}) {
    return(
        <Container {...restProps}>
            {children}
        </Container>
    );
}

Footer.Group = function FooterGroup({children, ...restProps}) {
    return (
        <Group {...restProps}>
            {children}
        </Group>
    );
}

Footer.Logo = function FooterLogo({children, ...restProps}) {
    return (
        <Logo {...restProps}>
            {children}
        </Logo>
    );
}

Footer.BigText = function FooterBigText({children, ...restProps}) {
    return (
        <BigText {...restProps}>
            {children}
        </BigText>
    );
}

Footer.Text = function FooterText({children, ...restProps}) {
    return (
        <Text {...restProps}>
            {children}
        </Text>
    );
}

Footer.Link = function FooterLink({children, ...restProps}) {
    return (
        <Link {...restProps}>
            {children}
        </Link>
    );
}

export default Footer;