import type { Tag } from 'src/types/tags';
import type { SyntheticEvent } from 'react';
import type { ContactPayload } from 'src/types/contacts';
import { Conversation, ConversationStatus } from 'src/types/chat';
import type { AutocompleteChangeReason, AutocompleteChangeDetails } from '@mui/material';

import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {
  Box,
  List,
  Chip,
  Button,
  ListItem,
  Collapse,
  useTheme,
  TextField,
  IconButton,
  ListItemIcon,
  ListItemText,
  Autocomplete,
  ListItemButton,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useCreateTag } from 'src/actions/tags';
import { useUpdateContact } from 'src/actions/contacts';
import {
  useGetConversations,
  useAddTagToConversation,
  useRemoveTagFromConversation,
} from 'src/actions/chat';

import { Iconify } from 'src/components/iconify';

import { CollapseButton } from './styles';
import { StatusFilters } from './chat-nav';

// ----------------------------------------------------------------------

type Props = {
  conversation: Conversation;
  allTags: Tag[];
};

export function ChatRoomSingle({ conversation, allTags }: Props) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(conversation.tags);
  const theme = useTheme();
  const router = useRouter();
  const collapseTag = useBoolean(true);
  const collapseConv = useBoolean(true);
  const { value: isEdit, onTrue: onEditTrue, onFalse: onEditFalse } = useBoolean(false);
  const { contact } = conversation;
  const initials = contact?.name
    .split(' ')
    .map((word) => word[0])
    .join('');

  const [formData, setFormData] = useState<ContactPayload>({
    name: contact?.name ?? '',
    phoneNumber: contact?.phoneNumber ?? '',
    email: contact?.email ?? '',
  });

  const handleChange =
    (field: keyof ContactPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const { mutate: updateMutation } = useUpdateContact();
  const { mutate: addTagMutation } = useAddTagToConversation();
  const { mutate: removeTagMutation } = useRemoveTagFromConversation();
  const { mutate: createTag } = useCreateTag();
  const { data: allContactConversations } = useGetConversations({
    contactId: contact?.id,
    filter: StatusFilters.ALL,
  });

  const previousConversations = allContactConversations?.items.filter(
    (conv) => conv.id !== conversation.id
  );

  const onSave = () => {
    if (!contact) return;
    updateMutation({ data: formData, id: contact?.id });
    onEditFalse();
  };

  const handleTagAdd = (tag?: Tag) => {
    if (!tag) return;
    addTagMutation(
      { conversationId: conversation.id, tagId: tag.id },
      {
        onError: (_err, variables) => {
          setSelectedTags((prev) => prev.filter((t) => t.id !== variables.tagId));
        },
      }
    );
  };

  const handleTagRemove = (tag?: Tag) => {
    if (!tag) return;
    removeTagMutation(
      { conversationId: conversation.id, tagId: tag.id },
      {
        onError: (_err, variables) => {
          const fallbackTag = allTags.find((t) => t.id === variables.tagId);
          if (fallbackTag) {
            setSelectedTags((prev) => [...prev, fallbackTag]);
          }
        },
      }
    );
  };

  const handleTagCreate = (tagName?: string) => {
    if (!tagName) return;
    createTag(tagName, {
      onSuccess: (newTag: Tag) => {
        setSelectedTags((prev) => prev.map((t) => (t.id === tagName ? newTag : t)));
        handleTagAdd(newTag);
      },
    });
  };

  const handleTagChange = (
    _event: SyntheticEvent<Element, Event>,
    _value: (string | Tag)[],
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<Tag> | undefined
  ) => {
    const option = details?.option;
    if (!option) return;

    if (reason === 'selectOption' && typeof option !== 'string') {
      setSelectedTags((prev) => [...prev, option]);
      handleTagAdd(option);
    }

    if (reason === 'removeOption' && typeof option !== 'string') {
      setSelectedTags((prev) => prev.filter((t) => t.id !== option.id));
      handleTagRemove(option);
    }

    if (reason === 'createOption' && typeof option === 'string') {
      const tempTag: Tag = {
        id: option,
        name: option,
        createdAt: option,
      };
      setSelectedTags((prev) => [...prev, tempTag]);
      handleTagCreate(option);
    }
  };

  const renderInfo = (
    <Stack alignItems="center" direction="row" justifyContent="center" sx={{ p: 3, gap: 2 }}>
      <Avatar alt={contact?.name} sx={{ width: 48, height: 48 }}>
        {initials}
      </Avatar>
      <Typography variant="subtitle1">{formData?.name}</Typography>
      <IconButton>
        <Iconify icon="ic:baseline-settings" />
      </IconButton>
    </Stack>
  );

  const renderContact = (
    <Stack spacing={2} sx={{ px: 2, py: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>Contact information</Typography>
        {!isEdit && (
          <IconButton onClick={onEditTrue}>
            <Iconify icon="ic:baseline-edit" fontSize="small" />
          </IconButton>
        )}
      </Box>
      {isEdit ? (
        <>
          <TextField
            fullWidth
            label="Name"
            size="small"
            value={formData.name ?? ''}
            onChange={handleChange('name')}
          />
          <TextField
            size="small"
            fullWidth
            label="Phone number"
            type="tel"
            value={formData.phoneNumber ?? ''}
            onChange={handleChange('phoneNumber')}
          />
          <TextField
            fullWidth
            size="small"
            label="Email"
            type="email"
            value={formData.email ?? ''}
            onChange={handleChange('email')}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button size="small" onClick={onEditFalse}>
              Cancel
            </Button>
            <Button size="small" variant="soft" color="primary" onClick={onSave}>
              Save
            </Button>
          </Box>
        </>
      ) : (
        <>
          <ListItemText primary="Phone number" secondary={formData.phoneNumber} />
          <ListItemText primary="Email" secondary={formData.email} />
        </>
      )}
    </Stack>
  );

  return (
    <>
      {renderInfo}

      {renderContact}
      <CollapseButton selected={collapseTag.value} onClick={collapseTag.onToggle}>
        Tags
      </CollapseButton>

      <Collapse in={collapseTag.value}>
        <Autocomplete
          multiple
          freeSolo
          disableClearable
          options={allTags.filter(
            (tag) => !selectedTags.some((selected) => selected.id === tag.id)
          )}
          value={selectedTags}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          renderTags={(value: readonly Tag[], getTagProps) =>
            value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip key={key} variant="outlined" size="small" label={option.name} {...tagProps} />
              );
            })
          }
          renderInput={(params) => <TextField {...params} placeholder="Add Tags" size="small" />}
          onChange={handleTagChange}
          sx={{ m: 2 }}
        />
      </Collapse>

      <CollapseButton selected={collapseConv.value} onClick={collapseConv.onToggle}>
        Previous conversation
      </CollapseButton>

      <Collapse in={collapseConv.value}>
        <Box sx={{ bgcolor: 'background.paper' }}>
          <nav aria-label="main mailbox folders">
            <List>
              {previousConversations?.map((conv) => (
                <ListItem
                  disablePadding
                  onClick={() => {
                    router.push(
                      `${paths.navigation.inboxBase}?status=${conv.status === ConversationStatus.RESOLVED ? 'closed' : 'all'}&id=${conv.inboxId}&conversationId=${conv.id}`
                    );
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <Iconify
                        icon="ic:baseline-chat"
                        width={16}
                        sx={{ color: theme.vars.palette.grey[600] }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={conv.subject} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </nav>
        </Box>
      </Collapse>
    </>
  );
}
