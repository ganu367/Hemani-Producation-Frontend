import styled from "styled-components/macro";

export const Container = styled.div(({ theme, marginVertical, maxHeight, maxWidth }) => `
    max-width: ${maxWidth ? maxWidth : "60rem"};
    max-height: ${maxHeight ? maxHeight : "60rem"};
    background: ${theme.backgroundColor1};
    border: 2px solid ${theme.backgroundColor4};
    border-radius: 0.5rem;
    overflow: auto;
    margin: ${marginVertical ? `${marginVertical} 0` : ""};

    &::-webkit-scrollbar
    {
        background: ${theme.backgroundColor1};
        position: absolute;
        width: 1rem;
        height: 1rem;
    }
    &::-webkit-scrollbar-thumb
    {
        background: ${theme.backgroundColor4};
        border-radius: 0.5rem;
        width: 1rem;
    }
    &::-webkit-scrollbar-button
    {
        display: none;
    }
`);

export const Table = styled.table(({ theme }) => `
    overflow: auto;
    border-radius: 0.5rem;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
`);

export const Body = styled.tbody(({ theme }) => `
    overflow: auto;
`);

export const Head = styled.thead(({ theme }) => `
    overflow: auto;
`);

export const Row = styled.tr(({ theme, header, last }) => `
    background: ${header ? theme.primaryColor2 : theme.backgroundColor1};
    border-radius: ${header ? "0.5rem 0.5rem 0 0" : "0"};
    font-weight:  ${header ? "bold" : "normal"};
    border-bottom: ${last ? "0" : `2px solid ${theme.backgroundColor3}`};
    overflow: auto;
    transitions: 0.3s all ease;

    &:hover {
        cursor: ${header ? "" : "pointer"};
        background: ${header ? theme.primaryColor2 : theme.backgroundColor2};
    }

    &:last-of-type
    {
        border-radius: ${header ? "0.5rem 0.5rem 0 0" : "0 0 0.5rem 0.5rem"};
    }
`);
export const SpecialRow = styled.div(({ theme, header }) => `
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: ${header ? theme.backgroundColor3 : theme.backgroundColor1};
    font-weight:  ${header ? "bold" : "normal"};
`);

export const Header = styled.th(({ theme, last, minWidth }) => `
    padding: 0.5rem 0;
    white-space: nowrap;
    min-width: ${minWidth ? minWidth : "10rem"};
`);

export const HeaderText = styled.div(({ theme, last }) => `
    // background: ${theme.backgroundColor1};
    padding: 0.5rem 1.5rem;
    border-right: ${last ? "0" : `2px solid ${theme.white}`};
    font-size: 1rem;
    color: ${theme.white};
    text-align: center;
    white-space: nowrap;
`);

export const Data = styled.td(({ theme, fontBold, textRight, arrow }) => `
    padding: 0.5rem;
    font-size: 1rem;
    font-weight: ${fontBold ? "bold" : "normal"};
    white-space: nowrap;
    width: 1%;
    padding: 1rem;
    // text-align: ${textRight ? "right" : "center"};
    color: ${arrow === "up" ? theme.success : arrow === "down" ? theme.danger : theme.textColor1};
`);

export const DataText = styled.div(({ theme, last, textRight }) => `
    display: flex;
    flex-direction: row;
    // background: black;
    justify-content: ${textRight ? "flex-end" : "center"};
    align-items: center;
    // padding-right: ${textRight ? "0.5rem" : ""};
    // text-align: ${textRight ? "right" : "right"};
`);

export const JobStatusBox = styled.div(({ theme, status, marginLeft, small }) => `
    // background: ${status === "Open" ? theme.primaryColor2 : status === "Closed" ? theme.backgroundColor3 : theme.backgroundColor2};
    border: 2px solid ${status === "Open" ? `${theme.info}a8` : status === "Closed" ? `${theme.danger}a8` : `${theme.info}a8`};
    background-color: ${status === "Open" ? `${theme.info}33` : status === "Closed" ? `${theme.danger}33` : `${theme.info}33`};
    padding: ${small ? "0.2rem 0.33rem" : "0.25rem 0.5rem"};
    border-radius: 1rem;
    font-size: ${small ? "0.75rem" : "0.9rem"};
    // color: ${status === "Open" ? theme.white : theme.textColor1};
    color: ${theme.textColor1};
    font-weight: normal;
    margin-left: ${marginLeft ? "0.5rem" : ""};
`);

export const AppStatusBox = styled.div(({ theme, status }) => `
    border: 2px solid ${status === "withdrawn" ? `${theme.caution}a8` : status === "shortlisted" ? `${theme.caution}a8` : status === "hired" ? `${theme.success}a8` : status === "rejected" ? `${theme.danger}a8` : `${theme.info}a8`};
    background-color: ${status === "withdrawn" ? `${theme.caution}33` : status === "shortlisted" ? `${theme.caution}33` : status === "hired" ? `${theme.success}33` : status === "rejected" ? `${theme.danger}33` : `${theme.info}33`};
    padding: 0.25rem 0.5rem;
    border-radius: 2rem;
    font-size: 0.9rem;
    color: ${theme.textColor1};
    font-weight: normal;

    // display: flex;
    // flex-direction: row;
    // justify-content: flex-start;
    // align-items: center;
`);

export const Box = styled.div(({ theme, status, color }) => `
    // background: ${status === "Open" ? theme.primaryColor2 : status === "Closed" ? theme.backgroundColor3 : theme.backgroundColor2};
    padding: 0.5rem;
    // border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8rem;
    // color: ${status === "Open" ? theme.white : theme.textColor1};
    color: ${color === "success" ? theme.success : color === "danger" ? theme.danger : color === "caution" ? theme.caution : color === "info" ? theme.info : theme.textColor1};
    font-weight: ${theme.type === "light" ? "bold" : "normal"};
`);

export const Icon = styled.div(({ theme, status, color }) => `
    margin-right: 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`);

export const EmptyRow = styled.div(({ theme, marginVertical, maxHeight, maxWidth }) => `
    min-width: ${maxWidth ? maxWidth : "60rem"};
    background: ${theme.backgroundColor1};
    // border: 2px solid ${theme.backgroundColor4};
    border-radius: 0.5rem;
    margin: 1rem 0;
    padding: 0.86rem;
`);