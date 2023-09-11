import styled from "styled-components/macro";
import { Markup } from 'interweave';
import { BsAsterisk } from "react-icons/bs";
import { BsArrowRight } from "react-icons/bs";

export const Container = styled.div( ({theme, width, rowDirection, noPadding, alignStart, forGrid, responsiveWidth}) => `
    padding: ${noPadding ? "0" : "1rem"};
    margin-bottom: 1rem;
    box-sizing: border-box;
    width: ${width ? width : "100%"};
    // min-height: ${ rowDirection? "100%" : "" };
    min-height: ${ forGrid ? "80%" : "" };
    border: ${ noPadding ? "none" : `3px solid ${theme.backgroundColor2}`};
    border-radius: 0.75rem;
    display: flex;
    flex-direction: ${rowDirection ? "row" : "column"};
    justify-content: flex-start;
    align-items: ${alignStart ? "flex-start" : "center"};
    background: ${theme.backgroundColor2};
    
    @media (max-width: 950px)
    {
        ${responsiveWidth ? `width: ${responsiveWidth};` : ""}
        flex-direction: ${rowDirection ? "column-reverse" : "column"};
    }
`);

export const RestContainer = styled.div( ({theme, width, noPadding}) => `
    padding: ${noPadding ? "0" : "1rem"};
    // margin-bottom: 1rem;
    box-sizing: border-box;
    width: ${width ? width : "100%"};
    height: 100%;                 // min-height: 85vh;
    border: ${ noPadding ? "none" : `3px solid ${theme.backgroundColor2}`};
    border-radius: 0.75rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    background: ${theme.backgroundColor2};
`);

export const RowContainer = styled.div( ({theme, width}) => `
    padding: 1rem;
    margin-bottom: 1rem;
    box-sizing: border-box;
    width: ${width ? width : "100%"};
    // min-height: 100%;
    border: 3px solid ${theme.backgroundColor2};
    border-radius: 0.75rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background: ${theme.backgroundColor2};
`);

export const Title = styled.div( ({theme, colored}) => `
    color: ${ colored ? theme.primaryColor2 : theme.textColor1};
    font-size: 1.25rem;
    font-weight: bold;
    display: flex;
    width: 100%;
    justify-content: space-between;

    @media (max-width: 950px)
    {
        justify-content: center;
    }
`);

export const Line = styled.div( ({theme}) => `
    background: ${theme.backgroundColor3};
    height: 0.15rem;
    width: 100%;
    border-radius: 0.5rem;
    margin: 1rem 0;
`);

export const ButtonGroup = styled.div( ({theme,flexStart,flexEnd,marginTop,marginLeft,marginBottom}) => `
    width: 100%;
    margin-top: ${ marginTop ? "0.5rem" : "0" };
    margin-left: ${ marginLeft ? "1rem" : "0" };
    margin-bottom: ${ marginBottom ? "1rem" : "0" };
    display: flex;
    flex-direction: row;
    justify-content: ${flexStart ? "flex-start" : (flexEnd ? "flex-end" : "center")};
    align-items: center;

    @media (max-width: 950px)
    {
        margin-top: 0.5rem;
    }
`);

export const Input = styled.input( ({theme, width, file}) => `
    border-radius: 0.5rem;
    width: ${width ? width : "100%"};
    font-size: 1rem;
    background: ${theme.backgroundColor1};
    border: 2px solid  ${theme.backgroundColor3};
    color: ${theme.textColor1};
    line-height: 2rem;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    font-family: Montserrat;

    &:focus
    {
        outline: none;
    }

    &[type=password]
    {
        font-size: 1.75rem;
    }

    &[type=file]::file-selector-button
    {
        border-radius: 5px;
        font-size: 0.9rem;
        cursor: pointer;
        background: ${theme.backgroundColor3};
        border: 0;
        color: ${theme.textColor2};
        padding: 3px 7px;
        font-family: Montserrat;

        &:focus
        {
            outline: none;
        }
    }

    &[type=file]
    {
        color: ${file ? theme.textColor1 : "transparent"};
    }

    ::-webkit-calendar-picker-indicator
    {
        cursor: pointer;
        font-size: 1.5rem;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 24 24"><path fill="%23bbbbbb" d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>');
    }
`);

export const Textarea = styled.textarea( ({theme, width}) => `
    border-radius: 0.5rem;
    resize: none;
    width: ${width ? width : "100%"};
    height: 10rem;
    font-size: 1rem;
    background: ${theme.backgroundColor1};
    border: 2px solid  ${theme.backgroundColor3};
    color: ${theme.textColor1};
    line-height: 2rem;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    font-family: Montserrat;

    &:focus
    {
        outline: none;
    }
    &::-webkit-scrollbar
    {
        position: absolute;
        width: 0.5rem;
    }
    &::-webkit-scrollbar-thumb
    {
        background: ${theme.backgroundColor3}; 
        border-radius: 0.5rem;
    }
    &::-webkit-scrollbar-button
    {
        display: none;
    }
`);

export const Required = styled(BsAsterisk)( ({theme}) => `
    position: absolute;
    right: 1rem;
    font-size: 0.75rem;
    font-weight: bold;
    text-align: center;
    top: -35%;

    ${Textarea}
    {
        top: -7%;
    }
    ${Input}
    {
        top: -21%;
    }
`);

export const ViewTitle = styled.div( ({theme, fontSize, noWrap, textAlign, marginBottom}) => `
    font-size: ${fontSize ? fontSize : "2rem"};
    font-weight: bold;
    color: ${theme.primaryColor2};
    text-align: ${textAlign ? textAlign : "center"};
    white-space: ${noWrap ? "nowrap" : ""};
    margin-bottom: ${ marginBottom ? "1rem" : ""};

    @media (max-width: 950px)
    {
        text-align: center;
    }
`);

export const ViewTitle2 = styled.div( ({theme, fontSize, noWrap, textAlign, marginBottom}) => `
    font-size: ${fontSize ? fontSize : "1.25rem"};
    font-weight: bold;
    color: ${theme.primaryColor2};
    text-align: ${textAlign ? textAlign : "center"};
    white-space: ${noWrap ? "nowrap" : ""};
    margin-bottom: ${ marginBottom ? "1rem" : ""};
    margin-left: -0.2rem;

    @media (max-width: 950px)
    {
        text-align: center;
    }
`);

export const ViewSubtitle = styled.div( ({theme, colored, bold}) => `
    font-size: ${ bold ? "1.1rem" : "1rem" };
    font-weight: ${ bold ? "bold" : "normal" };
    color: ${ colored ? theme.primaryColor2 : theme.textColor1};
    margin-top: 0.33rem;
    flex-direction: row;
    display: flex;
`);

export const ViewText = styled.div( ({theme, width, noWrap}) => `
    color: ${theme.textColor1};
    border-radius: 0.5rem;
    flex: 1;
    font-size: 1rem;
    background: ${theme.backgroundColor1};
    // border: 2px solid ${theme.backgroundColor3};
    color: ${theme.textColor1};
    line-height: 1.5rem;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    font-family: Montserrat;
    width: ${width ? width : "100%"};
    display: flex;
    white-space: ${noWrap ? "nowrap" : ""};
`);

export const ViewMarkupText = styled(Markup)( ({theme}) => `
    color: ${theme.textColor1};
    border-radius: 0.5rem;
    flex: 1;
    font-size: 1rem;
    background: ${theme.backgroundColor1};
    // border: 2px solid ${theme.backgroundColor3};
    color: ${theme.textColor1};
    line-height: 1.5rem;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    font-family: Montserrat;
    width: 100%;
    display: flex;
`);

export const ViewDash = styled.div( ({theme, symbol, noWrap}) => `
    color: ${theme.textColor1};
    flex: 0.1;
    font-size: ${ symbol ? "1.25rem" : "1rem" };
    color: ${theme.textColor1};
    line-height: 1.5rem;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    font-family: Montserrat;
    width: 100%;
    display: flex;
    justify-content: center;
    white-space: ${noWrap ? "nowrap" : ""};

    &:first-of-type
    {
        padding-left: 0;
    }

    @media (max-width: 950px)
    {
        white-space: ${noWrap ? "normal" : ""};
    }
`);

export const ViewLabel = styled.div( ({theme, width, paddingRight, noPaddingBottom, paddingBottom}) => `
    font-size: 0.9rem;
    line-height: 1rem;
    padding-bottom: ${noPaddingBottom ? "" : paddingBottom ? paddingBottom : "1rem"};
    padding-right: ${paddingRight ? "1rem" : ""};
    font-weight: bold;
    color: ${theme.textColor1};
    width: ${width ? width : "100%"};
    letter-spacing: 1px;

    @media (max-width: 950px)
    {
        padding-right: ${paddingRight ? "0" : ""};
        padding-bottom: 1rem;
    }
`);

export const ViewSubtitleLabel = styled.div( ({theme}) => `
    font-size: 0.9rem;
    font-weight: bold;
    color: ${theme.textColor1};
    width: fit-content;
    margin-right: 0.5rem;
    letter-spacing: 1px;
    white-space: nowrap;

    @media (max-width: 950px)
    {
        margin-bottom: 0.5rem;
    }
`);

export const ViewRow = styled.div( ({theme, width, justifyContent}) => `
    display: flex;
    flex-direction: column;
    justify-content: ${justifyContent ? justifyContent : "flex-start"};
    align-items: flex-start;
    width: ${width ? width : "100%"};

    @media (max-width: 950px)
    {
        align-items: center;
    }
`);

export const ViewColumn = styled.div( ({theme, notResponsive, marginTop}) => `
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-top: ${marginTop ? "1rem" : ""};

    @media (max-width: 950px)
    {
        flex-direction: ${ notResponsive ? "row" : "column" };
    }
`);

export const Label = styled.label( ({theme, mandatory, prefixx}) => `
    font-size: 1rem;
    font-family: Montserrat;
    color: ${theme.textColor2};
    cursor: text;
    position: absolute;
    top: 30%;
    left: ${prefixx ? "2rem" : "0.75rem"};
    transition: 0.2s ease all;
    width: fit-content;
    overflow: auto;
    white-space: nowrap;

    // {Input}:focus ~ &,
    // {Input}:not(:placeholder-shown){Input}:not(:focus) ~ &,
    // {Input}:active
    ${Input}:focus,
    ${Input}:active,
    ${Input}:not(:placeholder-shown) + &
    {
        background-color: ${theme.primaryColor2};
        padding: 0.2rem 0.5rem 0.2rem;
        border-radius: 0.5rem;
        top: -20%;
        left: ${prefixx ? "2rem" : "0.75rem"};
        font-size: 0.8rem;
        color: #fff;
    }

    ${Textarea}:not(:active),
    ${Textarea}:placeholder-shown + &
    {
        top: 10%;
    }

    ${Textarea}:focus,
    ${Textarea}:active,
    ${Textarea}:not(:placeholder-shown) + &
    {
        background-color: ${theme.primaryColor2};
        padding: 0.2rem 0.5rem 0.2rem;
        border-radius: 0.5rem;
        top: -7%;
        font-size: 0.8rem;
        color: #fff;
    }

    &::after
    {
        content: ${mandatory ? `"*"` : `""`};
        padding-left: ${mandatory ? "0.25rem" : "0" };
    }
`);

export const InputContainer = styled.div( ({theme, width, notAlone, flexEnd, center, noMarginTop, noMarginBottom, marginBottom, exceptLeft, exceptRight, suffix, prefixx, noMargin}) => `
    position: relative;
    width: ${width ? width : "100%"};
    display: flex;
    flex-direction: row;
    justify-content: ${ flexEnd ? "flex-end" : center ? "center" : "flex-start" };
    margin: 1rem;
    margin-left: ${notAlone ? "0" : "1rem" };
    margin-top: ${noMarginTop ? "0" : "1rem" };
    margin-bottom: ${noMarginBottom ? "0" : marginBottom ? marginBottom : "1rem" };
    ${noMargin ? "margin: 0;" : "" }
    align-items: center;

    @media (max-width: 950px)
    {
        margin-left: ${exceptLeft ? "0" : "1rem" };
        margin-right: ${exceptRight ? "0" : "1rem" };
        // margin-bottom: ${noMarginBottom ? "1rem" : "0" };
        justify-content: center;
    }

    &::before
    {
        content: ${prefixx ? `"${prefixx}"` : `""`};
        padding-right: ${prefixx ? "0.5rem" : "0" };
    }
    &::after
    {
        content: ${suffix ? `"${suffix}"` : `""`};
        padding-left: ${suffix ? "0.5rem" : "0" };
    }
`);

export const InputContainerTop = styled.div( ({theme, width, notAlone, flexEnd, center, noMarginTop, noMarginBottom, exceptLeft, exceptRight, suffix, prefixx}) => `
    position: relative;
    width: ${width ? width : "100%"};
    display: flex;
    flex-direction: row;
    justify-content: ${ flexEnd ? "flex-end" : center ? "center" : "flex-start" };
    margin: 1rem;
    margin-left: ${notAlone ? "0" : "1rem" };
    margin-top: ${noMarginTop ? "0" : "1rem" };
    margin-bottom: ${noMarginBottom ? "0" : "1rem" };
    align-items: center;

    @media (max-width: 950px)
    {
        margin-left: ${exceptLeft ? "0" : "1rem" };
        margin-right: ${exceptRight ? "0" : "1rem" };
        margin-bottom: ${noMarginBottom ? "1rem" : "0" };
        margin-top: ${noMarginTop ? "1rem" : "0" };
        justify-content: center;
    }

    &::before
    {
        content: ${prefixx ? `"${prefixx}"` : `""`};
        padding-right: ${prefixx ? "0.5rem" : "0" };
    }
    &::after
    {
        content: ${suffix ? `"${suffix}"` : `""`};
        padding-left: ${suffix ? "0.5rem" : "0" };
    }
`);

export const InputColumn = styled.div( ({theme, notResponsive, width, alignEnd, center, marginBottom}) => `
    width: ${width ? width : "100%"};
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: ${alignEnd ? "flex-end" : center ? "center" : "flex-start"};
    margin-bottom: ${marginBottom ? marginBottom : ""};

    @media (max-width: 950px)
    {
        flex-direction: ${ notResponsive ? "row" : "column" };
        align-items: center;
    }
`);

export const InputRow = styled.div( ({theme, width}) => `
    width: ${width ? width : "100%"};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    @media (max-width: 950px)
    {
        align-items: center;
    }
`);

export const Note = styled.div( ({theme, small}) => `
    width: 100%;
    padding: ${small ? "0.5rem" : "0.75rem"};
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-size: ${small ? "0.8rem" : ""};
    border: 2px solid rgba(0, 159, 255, 0.5);
    background-color: rgba(0, 159, 255, 0.2);
    border-radius: 0.5rem;
    color: ${theme.textColor1};
`);

export const NoteIcon = styled.div( ({theme, small}) => `
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: ${small ? "1rem" : "1.33rem"};
    margin-right: ${small ? "0.5rem" : "0.75rem"};
    font-weight: bold;
`);

export const GridContainer = styled.div( ({theme}) => `
    padding: 2rem;
    height: 100%;
    width: 100%;
`);

export const Icon = styled.div( ({theme}) => `
    color: ${theme.textColor3};
    position: absolute;
    right: 1rem;
    bottom: 13%;
    font-size: 1.5rem;
    cursor: pointer;

    &:hover
    {
        color: ${theme.textColor2};
    }
`);

export const FileInput = styled.input( ({theme, width, file}) => `
    border-radius: 0.5rem;
    width: ${width ? width : "100%"};
    font-size: 1rem;
    background: none;
    border: 2px solid  ${theme.backgroundColor3};
    color: ${theme.textColor1};
    line-height: 2rem;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    font-family: Montserrat;

    &:focus
    {
        outline: none;
    }

    &[type=password]
    {
        font-size: 1.75rem;
    }

    &[type=file]::file-selector-button
    {
        border-radius: 10px;
        font-size: 0.9rem;
        cursor: pointer;
        background: ${theme.backgroundColor3};
        border: 0;
        color: ${theme.textColor2};
        padding: 3px 7px;
        font-family: Montserrat;

        &:focus
        {
            outline: none;
        }
    }

    &[type=file]::after
    {
        content: "${file ? file : "No file chosen"}";
    }

    ::-webkit-calendar-picker-indicator
    {
        cursor: pointer;
        font-size: 1.5rem;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 24 24"><path fill="%23bbbbbb" d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>');
    }
`);

export const ImagePreview = styled.img( ({theme, alone}) => `
    height: 15rem;
    width: 15rem;
    object-fit: cover;
    border-radius: 1rem;
    border: 2px solid ${theme.backgroundColor3};
    padding: 0.5rem;
    margin-top: ${alone ? "" : "-0.5rem" };
`);

export const ImageEditIcon = styled.div( ({theme, alone}) => `
    border-radius: 5rem;
    background: ${theme.backgroundColor1};
    border: 2px solid ${theme.backgroundColor3};
    padding: 0.5rem;
    display: flex;
    font-size: 1.25rem;
    justify-content: center;
    align-items: center;
    color: ${theme.textColor2};
    transition: 0.3s ease all;
    position: absolute;
    top: -0.85rem;
    right: 2rem;

    &:hover
    {
        cursor: pointer;
        background: ${theme.backgroundColor3};
        transform: scale(0.9);
    }
`);

export const ImageRemoveIcon = styled.div( ({theme, alone}) => `
    border-radius: 5rem;
    background: ${theme.backgroundColor1};
    border: 2px solid ${theme.backgroundColor3};
    padding: 0.5rem;
    display: flex;
    font-size: 1.25rem;
    justify-content: center;
    align-items: center;
    color: ${theme.textColor2};
    transition: 0.3s ease all;
    position: absolute;
    top: -0.85rem;
    right: -0.85rem;

    &:hover
    {
        cursor: pointer;
        background: ${theme.backgroundColor3};
        transform: scale(0.9);
    }
`);

export const FileList = styled.div( ({theme, alone}) => `
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    // margin: -0.5rem 0 1rem;
`);

export const FilePreview = styled.div( ({theme}) => `
    display: flex;
    width: 100%;
    // margin-top: 0.5rem;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    border-radius: 0.5rem;
    border: 2px solid ${theme.backgroundColor3};
    background: ${theme.backgroundColor3};
    padding: 0.25rem;
    position: relative;
`);

export const FileProp = styled.div( ({theme}) => `
    font-size: 0.9rem;
    padding: 0.2rem;
    width: 90%;
`);

export const FileIcon = styled.div( ({theme}) => `
    color: ${theme.textColor2};
    position: absolute;
    right: 2.5%;
    font-size: 1.5rem;
    cursor: pointer;
    transition: 0.3s ease all;

    &:hover
    {
        color:  ${theme.textColor1};
    }
`);

export const FileColumn = styled.div( ({theme}) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
`);

export const PreviewLabel = styled.label( ({theme}) => `
    font-size: 0.8rem;
    font-family: Montserrat;
    color: #fff;
    cursor: text;
    position: absolute;
    border-radius: 0.5rem;
    background-color: ${theme.primaryColor2};
    top: -10%;
    left: 1%;
    padding: 0.2rem 0.5rem 0.2rem;
    transition: 0.2s ease all;
`);

export const Dropdown = styled.div( ({theme, dropdown, empty}) => `
    display: ${empty ? "none" : dropdown ? "flex" : "none"};
    flex-direction: column;
    position: absolute;
    top: 3.5rem;
    right: 0;
    width: 100%;
    min-height: 5rem;
    cursor: initial;
`);

export const DropdownContainer = styled.div( ({theme, flexDirection}) => `
    background-color: ${theme.backgroundColor1};
    color: ${theme.textColor1};
    border-radius: 0.75rem;
    box-sizing: border-box;
    border: 2px solid ${theme.backgroundColor3};
    // box-shadow: 0px 0px 15px 0px ${ (theme.type === 'light') ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)" };
    font-size: 1rem;
    width: 100%;
    padding: 0.5rem;
    min-height: calc(100% - 0.5rem);
    white-space: nowrap;
    position: absolute;
    top: 0.5rem;
    right: 0;
    display: flex;
    flex-direction: ${flexDirection === "column" ? "column" : "row" };
    justify-content: flex-start;
    align-items: center;
    max-height: 250%;
    overflow: auto;
    z-index: 2;

    &::-webkit-scrollbar
    {
        position: absolute;
    }
    &::-webkit-scrollbar-thumb
    {
        background: ${theme.backgroundColor3}; 
        border-radius: 0.5rem;
        width: 50%;
    }
    &::-webkit-scrollbar-button
    {
        display: none;
    }
`);

export const Option = styled.div( ({theme, selected, justifyStart}) => `
    border: ${selected ? `2px solid ${theme.backgroundColor2}` : "none" };
    width: 100%;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: Montserrat;
    display: flex;
    justify-content: ${ justifyStart ? "flex-start" : " center"};
    align-items: center;
    cursor: ${selected ? "cursor" : "pointer" };
    pointer-events: ${selected ? "none" : "auto" };
    padding: 1rem;
    color: ${selected ? theme.textColor3 : "inherit" };

    &:hover
    {
        background: ${selected ? "initial" : theme.backgroundColor2};
    }
`);

export const OptionButton = styled.div( ({theme, selected}) => `
    border-top: 3px solid ${theme.backgroundColor2};
    width: 100%;
    font-size: 1rem;
    font-family: Montserrat;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    margin-top: 0.25rem;
    color: ${selected ? theme.textColor3 : "inherit" };
`);

export const Question = styled.div( ({theme, paddingBottom}) => `
    font-size: 0.9rem;
    font-weight: bold;
    letter-spacing: 0.5px;
    color: ${theme.textColor2};
    padding-bottom: ${paddingBottom ? "0.86rem" : ""};
    text-align: justify;
`);

export const Tooltip = styled.div( ({theme}) => `
    font-size: 1.25rem;
    font-weight: bold;
    letter-spacing: 0.5px;
    color: ${theme.textColor3};
    padding-left: 0.5rem;
    cursor: pointer;

    &:hover ${TooltipText}
    {
        display: flex;
        flex-direction: column;
    }
`);

export const TooltipText = styled.div( ({theme}) => `
    font-size: 1rem;
    font-weight: normal;
    letter-spacing: 0.5px;
    background: ${theme.black};
    opacity: 0.75;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    max-width: 15rem;
    text-align: justify;
    color: ${theme.textColor1};
    padding-left: 0.5rem;
    cursor: pointer;
    display: none;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
`);

export const Placeholder = styled.div( ({theme, visible, right}) => `
    font-size: 0.86rem;
    font-weight: bold;
    color: ${theme.textColor3};
    position: absolute;
    display: ${visible ? "block" : "none"};
    right: ${right ? right : "2.25rem"};
    top: 25%;
    padding: 0.25rem;
    overflow-x: scroll;
    max-width: 50%;
    white-space: nowrap;

    &::-webkit-scrollbar
    {
        position: absolute;
        height: 0.1rem;
        display: none;
    }
    &::-webkit-scrollbar-thumb
    {
        background: ${theme.backgroundColor3}; 
        border-radius: 0.5rem;
        height: 0.1rem;
    }
    &::-webkit-scrollbar-button
    {
        display: none;
    }
`);

export const RightArrow = styled(BsArrowRight)( ({theme}) => `
    font-size: 1.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    width: fit-content;
    color: ${theme.textColor1};
    padding: 0 0.5rem;
`);

export const ButtonContainer = styled.div( ({theme, notVisible, width, notAlone, flexEnd, center, noMarginTop, noMarginBottom, marginBottom, exceptLeft, exceptRight, suffix, prefixx}) => `
    position: relative;
    visibility: ${notVisible ? "hidden" : "visible"};
    width: ${width ? width : "100%"};
    display: flex;
    flex-direction: column;
    justify-content: center;
    // margin: 1rem 0;
    // margin-left: ${notAlone ? "0" : "1rem" };
    // margin-top: ${noMarginTop ? "0" : "1rem" };
    // margin-bottom: ${noMarginBottom ? "0" : marginBottom ? marginBottom : "1rem" };
    align-items: center;

    &::before
    {
        content: ${prefixx ? `"${prefixx}"` : `""`};
        padding-right: ${prefixx ? "0.5rem" : "0" };
    }
    &::after
    {
        content: ${suffix ? `"${suffix}"` : `""`};
        padding-left: ${suffix ? "0.5rem" : "0" };
    }
`);

export const ButtonIcon = styled.div( ({theme}) => `
    font-size: 1.25rem;
    // margin-right: 0.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
`);

export const Header = styled.div( ({theme, width, noMarginVertical, marginRight}) => `
    margin: ${noMarginVertical ? "0 1rem" : "0.75rem 1rem"};
    ${marginRight ? `margin-right: ${marginRight};` : ""}
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: ${width ? width : "100%"};
    width: ${width === "buttonWidth" ? "2.35rem" : width};
    background: ${width === "buttonWidth" ? "red" : ""};
`);

export const HeaderText = styled.div( ({theme, width}) => `
    font-size: 1rem;
    // font-weight: bold;
    margin-left: 0.2rem;
    padding-bottom: 0.2rem;
    border-bottom: 2px solid ${theme.textColor3};
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: ${width ? width : ""};
`);

export const AddButton = styled.div( ({theme, small, big, nofill, danger, back, forGrid, marginTop, iconPadding, noMargin}) => `
    display: flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    padding: ${iconPadding? "4px 6px" : forGrid ? "1px 3px" : small ? "6px 10px" : (big ? "15px 20px" : "8px 12px")};
    font-size: ${small ? "0.9rem" : (big ? "1.5rem" : "1rem")};
    background: ${nofill ? "none" : (danger ? "#dc3545" : (back ? theme.backgroundColor4 : theme.primaryColor2))};
    color: ${nofill ? (danger ? "#dc3545" : theme.primaryColor2) : "#fff"};
    border: 2px solid ${danger ? "#dc3545" : theme.primaryColor2};
    border-radius: 0.7rem;
    margin: ${noMargin ? "0" : "0 0.5rem 0"};
    font-family: Montserrat;
    cursor: pointer;
    transition: 0.2s ease all;
    margin-top: ${ marginTop ? "0.5rem" : "0" };
    width: fit-content;
    white-space: nowrap;

    &:hover:not([disabled])
    {
        transform: scale(0.95);
    }

    &:disabled
    {
        opacity: 0.75;
        cursor: initial;
    }

    @media (max-width: 950px)
    {
        margin-top: 0;
    }
`);

export const MultiInput = styled.input( ({theme, width, file}) => `
    border-radius: 0.5rem;
    width: ${width ? width : "100%"};
    font-size: 1rem;
    line-height: 1.5rem;
    background: ${theme.backgroundColor1};
    border: 2px solid  ${theme.backgroundColor3};
    color: ${theme.textColor1};
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    font-family: Montserrat;

    &:focus
    {
        outline: none;
    }
`);

export const MultiInputContainer = styled.div( ({theme, width, flexEnd, center, suffix, prefixx, noMargin, smallMarginBottom}) => `
    position: relative;
    width: ${width ? width : "100%"};
    display: flex;
    flex-direction: row;
    justify-content: ${ flexEnd ? "flex-end" : center ? "center" : "flex-start" };
    margin: 0.75rem;
    ${noMargin ? "margin: 0;" : "" }
    align-items: center;
    margin-bottom: ${smallMarginBottom ? "0.25rem" : "0.75rem"};

    &::before
    {
        content: ${prefixx ? `"${prefixx}"` : `""`};
        padding-right: ${prefixx ? "0.5rem" : "0" };
    }
    &::after
    {
        content: ${suffix ? `"${suffix}"` : `""`};
        padding-left: ${suffix ? "0.5rem" : "0" };
    }
`);

export const Status = styled.div( ({theme, status, marginTop}) => `
    margin-top: ${marginTop ? "0.5rem" : ""};
    padding: 0.33rem;
    font-size: 0.9rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    text-transform: capitalize;
    border: 2px solid ${status === "withdrawn" ? `${theme.caution}a8` : status === "shortlisted" ? `${theme.caution}a8` : status === "open" ? `${theme.success}a8` : status === "closed" ? `${theme.danger}a8` : `${theme.info}a8`};
    background-color: ${status === "withdrawn" ? `${theme.caution}33` : status === "shortlisted" ? `${theme.caution}33` : status === "open" ? `${theme.success}33` : status === "closed" ? `${theme.danger}33` : `${theme.info}33`};
    border-radius: 0.5rem;
    color: ${theme.textColor1};
`);
