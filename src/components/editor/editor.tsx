import { Resizable } from 're-resizable';
import LinkExtension from '@tiptap/extension-link';
import StarterKitExtension from '@tiptap/starter-kit';
import ImageResize from 'tiptap-extension-resize-image';
import { useEditor, EditorContent } from '@tiptap/react';
import TextAlignExtension from '@tiptap/extension-text-align';
import PlaceholderExtension from '@tiptap/extension-placeholder';
import { useState, useEffect, forwardRef, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Portal from '@mui/material/Portal';
import Backdrop from '@mui/material/Backdrop';
import FormHelperText from '@mui/material/FormHelperText';

import { useUploadAttachment } from 'src/actions/chat';

import { Toolbar } from './toolbar';
import { StyledRoot } from './styles';
import { editorClasses } from './classes';
import ConditionalWrapper from '../utils/conditional-wrapper';

import type { EditorProps } from './types';

// ----------------------------------------------------------------------

export const Editor = forwardRef<HTMLDivElement, EditorProps>(
  (
    {
      sx,
      error,
      onChange,
      slotProps,
      helperText,
      resetValue,
      conversationId,
      editable = true,
      fullItem = false,
      value: content = '',
      templateSet,
      placeholder = 'Write a message...',
      isResizible,
      ...other
    },
    ref
  ) => {
    const [fullScreen, setFullScreen] = useState(false);

    const handleToggleFullScreen = useCallback(() => {
      setFullScreen((prev) => !prev);
    }, []);

    const { mutate: uploadMutation } = useUploadAttachment();

    const editor = useEditor({
      content,
      editable,
      extensions: [
        StarterKitExtension.configure({
          codeBlock: false,
          code: { HTMLAttributes: { class: editorClasses.content.codeInline } },
          heading: { HTMLAttributes: { class: editorClasses.content.heading } },
          horizontalRule: { HTMLAttributes: { class: editorClasses.content.hr } },
          listItem: { HTMLAttributes: { class: editorClasses.content.listItem } },
          blockquote: { HTMLAttributes: { class: editorClasses.content.blockquote } },
          bulletList: { HTMLAttributes: { class: editorClasses.content.bulletList } },
          orderedList: { HTMLAttributes: { class: editorClasses.content.orderedList } },
        }),
        PlaceholderExtension.configure({
          placeholder,
          emptyEditorClass: editorClasses.content.placeholder,
        }),
        ImageResize.configure({
          HTMLAttributes: { class: editorClasses.content.image, style: 'width: auto' },
        }),
        TextAlignExtension.configure({ types: ['heading', 'paragraph'] }),
        LinkExtension.configure({
          autolink: true,
          openOnClick: false,
          HTMLAttributes: { class: editorClasses.content.link },
        }),
      ],
      onUpdate({ editor: _editor }) {
        console.log('ovde@');
        const html = _editor.getHTML();
        onChange?.(html);
      },
      onCreate({ editor: _editor }) {
        console.log('ovde');
        _editor.commands.focus(2);
      },
      ...other,
    });

    useEffect(() => {
      const timer = setTimeout(() => {
        if (editor?.isEmpty && content !== '<p></p>') {
          editor.commands.setContent(content);
        }
      }, 100);
      return () => clearTimeout(timer);
    }, [content, editor]);

    useEffect(() => {
      if (resetValue && !content) {
        editor?.commands.clearContent();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    useEffect(() => {
      if (fullScreen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }, [fullScreen]);

    const handleUpload = (file: File) => {
      if (!conversationId) return;
      uploadMutation(
        { file, conversationId },
        {
          onSuccess: (data) => {
            editor?.chain().focus().setImage({ src: data.url }).run();
          },
        }
      );
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        if (editor) {
          const { doc } = editor.state;
          let secondParagraphPos = null;
          let paragraphCount = 0;

          doc.descendants((node, pos) => {
            if (node.type.name === 'paragraph') {
              paragraphCount += 1;
              if (paragraphCount === 2) {
                secondParagraphPos = pos + 1;
                return false;
              }
            }
            return true;
          });

          if (secondParagraphPos !== null) {
            editor.commands.focus(secondParagraphPos);
          }
        }
      }, 500);

      return () => clearTimeout(timer);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [templateSet]);

    return (
      <Portal disablePortal={!fullScreen}>
        {fullScreen && <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal - 1 }} />}

        <Stack
          sx={{
            ...(!editable && { cursor: 'not-allowed' }),
            ...slotProps?.wrap,
          }}
        >
          <ConditionalWrapper
            condition={isResizible}
            wrapper={(children) => (
              <Resizable
                enable={{ top: true }}
                minHeight={150}
                maxHeight={720}
                defaultSize={{ height: 250, width: '100%' }}
                style={{ width: '100%' }}
                handleStyles={{
                  top: {
                    height: '8px',
                    top: '-4px',
                    background: 'transparent',
                    cursor: 'ns-resize',
                  },
                }}
              >
                {children}
              </Resizable>
            )}
          >
            <StyledRoot
              error={!!error}
              disabled={!editable}
              fullScreen={fullScreen}
              className={editorClasses.root}
              sx={{
                ...sx,
                height: 'inherit',
                '.ProseMirror': {
                  height: '100%',
                  overflowY: 'auto',
                },
              }}
            >
              <Toolbar
                editor={editor}
                fullItem={fullItem}
                fullScreen={fullScreen}
                onUpload={handleUpload}
                onToggleFullScreen={handleToggleFullScreen}
              />
              <EditorContent
                ref={ref}
                spellCheck="false"
                autoComplete="off"
                autoCapitalize="off"
                editor={editor}
                height="100%"
                className={editorClasses.content.root}
              />
            </StyledRoot>
          </ConditionalWrapper>

          {helperText && (
            <FormHelperText error={!!error} sx={{ px: 2 }}>
              {helperText}
            </FormHelperText>
          )}
        </Stack>
      </Portal>
    );
  }
);
