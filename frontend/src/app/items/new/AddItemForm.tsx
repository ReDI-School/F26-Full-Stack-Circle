'use client';

import { useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, ImageSlot, Select, TextField, Textarea } from '@/components';
import { api, ApiError } from '@/config/api';
import { useApi, useToast } from '@/hooks';
import { parsePriceToCents } from '@/lib/price';

type Category = { id: string; name: string };

type FieldName = 'title' | 'price' | 'categoryId' | 'condition' | 'description' | 'photos';
type FieldErrors = Partial<Record<FieldName, string>>;

const CONDITIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'LIKE_NEW', label: 'Like new' },
  { value: 'GOOD', label: 'Good' },
  { value: 'USED', label: 'Used' },
];

const PHOTO_SLOTS = 3;

const SERVER_FIELD_MAP: Record<string, FieldName> = {
  title: 'title',
  description: 'description',
  priceCents: 'price',
  condition: 'condition',
  categoryId: 'categoryId',
  photoUrls: 'photos',
};

const isHttpUrl = (value: string) => {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

const AddItemForm = () => {
  const router = useRouter();
  const toast = useToast();
  const { data: categoryData, loading: categoriesLoading } = useApi<{ categories: Category[] }>(
    '/categories'
  );
  const categories = categoryData?.categories ?? [];

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [condition, setCondition] = useState(CONDITIONS[0].value);
  const [description, setDescription] = useState('');
  // No file storage in v1: each slot holds an image URL, previewed live by ImageSlot.
  const [photoUrls, setPhotoUrls] = useState<string[]>(() => Array(PHOTO_SLOTS).fill(''));

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const selectedCategoryId = categoryId || categories[0]?.id || '';

  const setPhotoUrl = (index: number, url: string) => {
    setPhotoUrls((current) => current.map((value, i) => (i === index ? url : value)));
  };

  const validate = () => {
    const errors: FieldErrors = {};
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3) errors.title = 'Title must be at least 3 characters.';
    else if (trimmedTitle.length > 120) errors.title = 'Title must be at most 120 characters.';

    const parsedPrice = parsePriceToCents(price);
    if (!parsedPrice.ok) errors.price = parsedPrice.error;

    if (!selectedCategoryId) errors.categoryId = 'Choose a category.';
    if (description.trim().length > 2000) {
      errors.description = 'Description must be at most 2000 characters.';
    }

    const urls = photoUrls.map((url) => url.trim()).filter(Boolean);
    if (urls.some((url) => !isHttpUrl(url))) {
      errors.photos = 'Photo links must start with http:// or https://.';
    }

    return { errors, priceCents: parsedPrice.ok ? parsedPrice.cents : null, urls };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;

    setFormError(null);
    const { errors, priceCents, urls } = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0 || priceCents === null) return;

    submittingRef.current = true;
    setSubmitting(true);
    try {
      await api.post('/items', {
        title: title.trim(),
        description: description.trim(),
        priceCents,
        condition,
        categoryId: selectedCategoryId,
        photoUrls: urls,
      });
      toast.success("Item listed! It's live in your shop.");
      router.push('/shop');
    } catch (error) {
      submittingRef.current = false;
      setSubmitting(false);

      if (error instanceof ApiError) {
        const serverErrors: FieldErrors = {};
        for (const [field, message] of Object.entries(error.fields)) {
          const name = SERVER_FIELD_MAP[field];
          if (name) serverErrors[name] = [message].flat().join(' ');
        }
        setFieldErrors(serverErrors);
        if (Object.keys(serverErrors).length === 0) setFormError(error.message);
      } else {
        setFormError('Unable to list your item. Please try again.');
      }
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-7 rounded-[24px] border border-border bg-surface p-8 min-[800px]:grid-cols-[280px_1fr]"
    >
      <fieldset className="flex min-w-0 flex-col gap-2.5">
        <legend className="mb-1.5 font-bold text-ink">Photos</legend>

        <ImageSlot
          value={photoUrls[0].trim() || undefined}
          onChange={() => setPhotoUrl(0, '')}
          alt="Main photo"
          placeholder="Drop the main photo"
          className="h-[220px] w-full max-w-[280px]"
        />
        <TextField
          label="Main photo URL"
          type="url"
          inputMode="url"
          placeholder="https://…"
          value={photoUrls[0]}
          onChange={(e) => setPhotoUrl(0, e.target.value)}
        />

        <div className="grid max-w-[280px] grid-cols-2 gap-2.5">
          {photoUrls.slice(1).map((url, offset) => {
            const index = offset + 1;
            return (
              <div key={index} className="flex min-w-0 flex-col gap-2">
                <ImageSlot
                  value={url.trim() || undefined}
                  onChange={() => setPhotoUrl(index, '')}
                  alt={`Photo ${index + 1}`}
                  placeholder="+ photo"
                  className="h-16 w-full"
                />
                <TextField
                  label={`Photo ${index + 1} URL`}
                  type="url"
                  inputMode="url"
                  placeholder="https://…"
                  value={url}
                  onChange={(e) => setPhotoUrl(index, e.target.value)}
                />
              </div>
            );
          })}
        </div>

        {fieldErrors.photos ? (
          <p role="alert" className="text-caption text-secondary">
            {fieldErrors.photos}
          </p>
        ) : null}
      </fieldset>

      <div className="flex min-w-0 flex-col gap-5">
        <TextField
          label="Title"
          placeholder="e.g. Vintage denim jacket"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={fieldErrors.title}
          maxLength={120}
          required
        />

        <div className="grid grid-cols-1 gap-4 min-[940px]:grid-cols-3 min-[940px]:max-[1000px]:[&_label]:text-caption">
          <TextField
            label="Price (€) · 0 = give away"
            inputMode="decimal"
            placeholder="18"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={fieldErrors.price}
            required
          />
          <Select
            label="Category"
            options={categories.map((category) => ({ value: category.id, label: category.name }))}
            placeholder={categoriesLoading ? 'Loading…' : 'Choose a category'}
            value={selectedCategoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={categoriesLoading}
            error={fieldErrors.categoryId}
            required
          />
          <Select
            label="Condition"
            options={CONDITIONS}
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            error={fieldErrors.condition}
            required
          />
        </div>

        <Textarea
          label="Description"
          rows={4}
          placeholder="Size, brand, quirks, why you're letting it go…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={fieldErrors.description}
          maxLength={2000}
        />

        <div className={`${fieldErrors.description ? '-mt-7' : '-mt-12'} flex flex-col gap-3`}>
          {formError ? (
            <p role="alert" className="text-danger-text">
              {formError}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="primary" disabled={submitting} aria-busy={submitting}>
              {submitting ? 'Listing…' : 'List it 🎉'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.push('/')}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddItemForm;
