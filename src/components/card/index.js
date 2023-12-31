import React from 'react';
import { Container, RestContainer, Line, Title, Required, ButtonGroup, InputContainer, InputContainerTop, InputColumn, InputRow, FileColumn, ViewRow, ViewColumn, ViewTitle, ViewTitle2, ViewSubtitle, ViewSubtitleLabel, ViewText, ViewMarkupText, ViewDash, ViewLabel, Input, Textarea, Label, GridContainer, Icon, FileInput, ImagePreview, ImageEditIcon, ImageRemoveIcon, Dropdown, DropdownContainer, Option, OptionButton, PreviewLabel, FileList, FilePreview, FileProp, FileIcon, Note, NoteIcon, Question, Tooltip, TooltipText, Placeholder, RightArrow, AddButton, ButtonContainer, ButtonIcon, Header, HeaderText, MultiInput, MultiInputContainer, Status } from './styles/card';
import { MdEdit } from "react-icons/md";
import { GoPlus, GoCheck } from "react-icons/go";
import { AiFillDelete, AiOutlineQuestionCircle } from "react-icons/ai";

function Card({children, ...restProps}) {
    return(
        <Container {...restProps}>
            {children}
        </Container>
    );
}

Card.RestContainer = function CardRestContainer({children, ...restProps}) {
    return (
        <RestContainer {...restProps}>
            {children}
        </RestContainer>
    );
}

Card.Line = function CardLine({children, ...restProps}) {
    return (
        <Line {...restProps}>
            {children}
        </Line>
    );
}

Card.Title = function CardTitle({children, ...restProps}) {
    return (
        <Title {...restProps}>
            {children}
        </Title>
    );
}

Card.ButtonGroup = function CardButtonGroup({children, ...restProps}) {
    return (
        <ButtonGroup {...restProps}>
            {children}
        </ButtonGroup>
    );
}

Card.InputColumn = function CardInputColumn({children, refPointer, ...restProps}) {
    return (
        <InputColumn {...restProps} ref={refPointer}>
            {children}
        </InputColumn>
    );
}

Card.InputRow = function CardInputRow({children, refPointer, ...restProps}) {
    return (
        <InputRow {...restProps} ref={refPointer}>
            {children}
        </InputRow>
    );
}

Card.InputContainer = function CardInputContainer({children, refPointer, ...restProps}) {
    return (
        <InputContainer {...restProps} ref={refPointer}>
            {children}
        </InputContainer>
    );
}

Card.InputContainerTop = function CardInputContainerTop({children, refPointer, ...restProps}) {
    return (
        <InputContainerTop {...restProps} ref={refPointer}>
            {children}
        </InputContainerTop>
    );
}

Card.Label = function CardLabel({children, ...restProps}) {
    return (
        <Label {...restProps}>
            {children}
        </Label>
    );
}

Card.PreviewLabel = function CardPreviewLabel({children, ...restProps}) {
    return (
        <PreviewLabel {...restProps}>
            {children}
        </PreviewLabel>
    );
}

Card.Required = function CardRequired({children, ...restProps}) {
    return (
        <Required {...restProps}>
            {children}
        </Required>
    );
}

Card.ViewRow = function CardViewRow({children, ...restProps}) {
    return (
        <ViewRow {...restProps}>
            {children}
        </ViewRow>
    );
}

Card.ViewColumn = function CardViewColumn({children, ...restProps}) {
    return (
        <ViewColumn {...restProps}>
            {children}
        </ViewColumn>
    );
}

Card.ViewTitle = function CardViewTitle({children, ...restProps}) {
    return (
        <ViewTitle {...restProps}>
            {children}
        </ViewTitle>
    );
}

Card.ViewTitle2 = function CardViewTitle2({children, ...restProps}) {
    return (
        <ViewTitle2 {...restProps}>
            {children}
        </ViewTitle2>
    );
}

Card.ViewSubtitle = function CardViewSubtitle({children, ...restProps}) {
    return (
        <ViewSubtitle {...restProps}>
            {children}
        </ViewSubtitle>
    );
}

Card.ViewText = function CardViewText({children, ...restProps}) {
    return (
        <ViewText {...restProps}>
            {children}
        </ViewText>
    );
}

Card.ViewMarkupText = function CardViewMarkupText({children, ...restProps}) {
    return (
        <ViewMarkupText {...restProps}>
            {children}
        </ViewMarkupText>
    );
}

Card.ViewDash = function CardViewDash({children, ...restProps}) {
    return (
        <ViewDash {...restProps}>
            {children}
        </ViewDash>
    );
}

Card.ViewLabel = function CardViewLabel({children, ...restProps}) {
    return (
        <ViewLabel {...restProps}>
            {children}
        </ViewLabel>
    );
}

Card.Input = function CardInput({children, refPointer, ...restProps}) {
    return (
        <Input {...restProps} ref={refPointer}>
            {children}
        </Input>
    );
}

Card.Textarea = function CardTextarea({children, ...restProps}) {
    return (
        <Textarea {...restProps}>
            {children}
        </Textarea>
    );
}

Card.GridContainer = function CardGridContainer({children, ...restProps}) {
    return (
        <GridContainer {...restProps}>
            {children}
        </GridContainer>
    );
}

Card.Icon = function CardIcon({children, ...restProps}) {
    return (
        <Icon {...restProps}>
            {children}
        </Icon>
    );
}

Card.FileInput = function CardFileInput({children, ...restProps}) {
    return (
        <FileInput {...restProps}>
            {children}
        </FileInput>
    );
}

Card.ImagePreview = function CardImagePreview({children, ...restProps}) {
    return (
        <ImagePreview {...restProps}>
            {children}
        </ImagePreview>
    );
}

Card.ImageEditIcon = function CardImageEditIcon({children, ...restProps}) {
    return (
        <ImageEditIcon {...restProps}>
            <MdEdit />
            {children}
        </ImageEditIcon>
    );
}

Card.ImageRemoveIcon = function CardImageRemoveIcon({children, ...restProps}) {
    return (
        <ImageRemoveIcon {...restProps}>
            <AiFillDelete />
            {children}
        </ImageRemoveIcon>
    );
}

Card.Dropdown = function CardDropdown({children, ...restProps}) {
    return (
        <Dropdown {...restProps}>
            <DropdownContainer {...restProps}>
                {children}
            </DropdownContainer>
        </Dropdown>
    );
}

Card.Option = function CardOption({children, ...restProps}) {
    return (
        <Option {...restProps}>
            {children}
        </Option>
    );
}

Card.OptionButton = function CardOptionButton({children, ...restProps}) {
    return (
        <OptionButton {...restProps}>
            {children}
        </OptionButton>
    );
}

Card.FileList = function CardFileList({children, ...restProps}) {
    return (
        <FileList {...restProps}>
            {children}
        </FileList>
    );
}

Card.FilePreview = function CardFilePreview({children, ...restProps}) {
    return (
        <FilePreview {...restProps}>
            {children}
        </FilePreview>
    );
}

Card.FileProp = function CardFileProp({children, ...restProps}) {
    return (
        <FileProp {...restProps}>
            {children}
        </FileProp>
    );
}

Card.FileIcon = function CardFileIcon({children, ...restProps}) {
    return (
        <FileIcon {...restProps}>
            {children}
        </FileIcon>
    );
}

Card.FileColumn = function CardFileColumn({children, ...restProps}) {
    return (
        <FileColumn {...restProps}>
            {children}
        </FileColumn>
    );
}

Card.Note = function CardNote({children, ...restProps}) {
    return (
        <Note {...restProps}>
            {children}
        </Note>
    );
}

Card.NoteIcon = function CardNoteIcon({children, ...restProps}) {
    return (
        <NoteIcon {...restProps}>
            {children}
        </NoteIcon>
    );
}

Card.ViewSubtitleLabel = function CardViewSubtitleLabel({children, ...restProps}) {
    return (
        <ViewSubtitleLabel {...restProps}>
            {children}
        </ViewSubtitleLabel>
    );
}

Card.Question = function CardQuestion({children, ...restProps}) {
    return (
        <Question {...restProps}>
            {children}
        </Question>
    );
}

Card.Tooltip = function CardTooltip({children, ...restProps}) {
    return (
        <Tooltip {...restProps}>
            <AiOutlineQuestionCircle />
            <TooltipText>{children}</TooltipText>
        </Tooltip>
    );
}

Card.Placeholder = function CardPlaceholder({children, ...restProps}) {
    return (
        <Placeholder {...restProps}>
            {children}
        </Placeholder>
    );
}

Card.RightArrow = function CardRightArrow({children, ...restProps}) {
    return (
        <RightArrow {...restProps}>
            {children}
        </RightArrow>
    );
}

Card.ButtonContainer = function CardButtonContainer({children, ...restProps}) {
    return (
        <ButtonContainer {...restProps}>
            {children}
        </ButtonContainer>
    );
}

Card.AddButton = function CardAddButton({children, deletes, edits, ...restProps}) {
    return (
        <AddButton {...restProps}>
            {deletes &&
                <>
                    <ButtonIcon><AiFillDelete /></ButtonIcon>{/*Remove*/}
                </>
            }
            {edits &&
                // edits === "edit" ? (
                <>
                    <ButtonIcon><MdEdit /></ButtonIcon>{/*Edit*/}
                </>
                // ) : (
                // <>
                //     <ButtonIcon><GoCheck /></ButtonIcon>{/*Edit*/}
                // </>
                // )
            }
            {!deletes && !edits &&
                <>
                    <ButtonIcon><GoPlus /></ButtonIcon>{/*Add*/}
                </>
            }
            {children}
        </AddButton>
    );
}

Card.Header = function CardHeader({children, ...restProps}) {
    return (
        <Header {...restProps}>
            {children}
        </Header>
    );
}

Card.HeaderText = function CardHeaderText({children, ...restProps}) {
    return (
        <HeaderText {...restProps}>
            {children}
        </HeaderText>
    );
}

Card.MultiInput = function CardMultiInput({children, ...restProps}) {
    return (
        <MultiInput {...restProps}>
            {children}
        </MultiInput>
    );
}

Card.MultiInputContainer = function CardMultiInputContainer({children, refPointer, ...restProps}) {
    return (
        <MultiInputContainer {...restProps} ref={refPointer}>
            {children}
        </MultiInputContainer>
    );
}

Card.Status = function CardStatus({children, refPointer, ...restProps}) {
    return (
        <Status {...restProps} ref={refPointer}>
            {children}
        </Status>
    );
}

export default Card;