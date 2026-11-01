'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';

import { Button, CategoryChip, ItemCard, Textarea, TextField } from '@/components';

import {
  categories,
  conditions,
  initialItem,
  type CreateItemRequest,
  type CreateItemResponse,
} from './CreateItem.fixtures';

interface CreateItemDemoProps {
  initialValues?: Partial<CreateItemRequest>;
  submit: (request: CreateItemRequest) => Promise<CreateItemResponse>;
}

export const CreateItemDemo = ({ initialValues, submit }: CreateItemDemoProps) => {
  const initial = { ...initialItem, ...initialValues };
  const [values, setValues] = useState(initial);
  const [price, setPrice] = useState(String(initial.priceCents));
  const [photos, setPhotos] = useState((initial.photoUrls ?? []).join('\n'));
  const [pending, setPending] = useState(false);
  const [response, setResponse] = useState<CreateItemResponse | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const outcomeRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLElement>(null);
  const id = useId();
  const fields: Record<string, string> = response?.status === 400 ? response.body.fields : {};
  const item = response?.status === 201 ? response.body.item : null;

  useEffect(() => {
    if (!response) return;

    const invalidField = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    (invalidField ?? outcomeRef.current)?.focus();
  }, [response]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setResponse(null);

    try {
      const photoUrls = photos
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean);
      const result = await submit({
        title: values.title,
        description: values.description,
        priceCents: price.trim() ? Number(price) : Number.NaN,
        condition: values.condition,
        categoryId: values.categoryId,
        ...(photoUrls.length ? { photoUrls } : {}),
      });
      setResponse(result);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg px-4 py-8 text-ink sm:px-8 sm:py-12 [&_.text-muted]:text-body">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-bold tracking-widest text-tertiary">YOUR SHOP</p>
            <h1>Give something a second life.</h1>
            <p className="mt-3 max-w-xl text-body">
              A little detail helps your next neighbour find the right thing.
            </p>
          </div>
          <span className="rounded-pill bg-tertiary-100 px-4 py-2 text-sm font-bold text-tertiary">
            List an item
          </span>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-3">
          <form
            ref={formRef}
            aria-label="List an item"
            aria-busy={pending}
            noValidate
            onSubmit={handleSubmit}
            className="min-w-0 rounded-card border border-border bg-surface p-5 sm:p-7 lg:col-span-2 [&_span[id$=-error]]:text-danger-text"
          >
            <div className="space-y-5">
              <TextField
                label="Item title"
                name="title"
                required
                value={values.title}
                error={fields.title}
                onChange={(event) => setValues({ ...values, title: event.target.value })}
              />
              <Textarea
                label="Description"
                name="description"
                rows={3}
                value={values.description}
                error={fields.description}
                helperText="Tell us about its size, condition and anything a buyer should know."
                onChange={(event) => setValues({ ...values, description: event.target.value })}
              />

              <fieldset
                aria-invalid={fields.categoryId ? true : undefined}
                aria-describedby={fields.categoryId ? `${id}-category-error` : undefined}
                tabIndex={fields.categoryId ? -1 : undefined}
              >
                <legend className="mb-2 font-bold">Category</legend>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <CategoryChip
                      key={category.id}
                      label={category.name}
                      selected={values.categoryId === category.id}
                      onClick={() => setValues({ ...values, categoryId: category.id })}
                    />
                  ))}
                </div>
                {fields.categoryId ? (
                  <p id={`${id}-category-error`} className="mt-2 text-sm text-danger-text">
                    {fields.categoryId}
                  </p>
                ) : null}
              </fieldset>

              <fieldset
                aria-invalid={fields.condition ? true : undefined}
                aria-describedby={fields.condition ? `${id}-condition-error` : undefined}
                tabIndex={fields.condition ? -1 : undefined}
              >
                <legend className="mb-2 font-bold">Condition</legend>
                <div className="flex flex-wrap gap-2">
                  {conditions.map((condition) => (
                    <CategoryChip
                      key={condition.value}
                      label={condition.label}
                      selected={values.condition === condition.value}
                      onClick={() => setValues({ ...values, condition: condition.value })}
                    />
                  ))}
                </div>
                {fields.condition ? (
                  <p id={`${id}-condition-error`} className="mt-2 text-sm text-danger-text">
                    {fields.condition}
                  </p>
                ) : null}
              </fieldset>

              <div>
                <TextField
                  label="Price in cents"
                  name="priceCents"
                  inputMode="numeric"
                  required
                  value={price}
                  error={fields.priceCents}
                  onChange={(event) => setPrice(event.target.value)}
                />
                <p className="mt-2 text-sm text-body">
                  1200 cents is €12.00. Enter 0 to give it away.
                </p>
              </div>

              <Textarea
                label="Photo links (optional)"
                name="photoUrls"
                rows={2}
                value={photos}
                error={fields.photoUrls}
                helperText="One http or https link per line. Up to 5 photos, in the order you want."
                onChange={(event) => setPhotos(event.target.value)}
              />
              <Button type="submit" variant="secondary" stretch disabled={pending}>
                {pending ? 'Listing your item…' : 'List item'}
              </Button>
            </div>
          </form>

          <aside className="min-w-0 space-y-5" aria-label="Submission result">
            <div
              ref={outcomeRef}
              tabIndex={-1}
              role={response && response.status !== 201 ? 'alert' : 'status'}
              className="rounded-card border border-border bg-surface p-6 outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
            >
              <p className="mb-3 text-sm font-bold tracking-wide text-title">
                {response ? `${response.status} response` : 'A fresh start for your item'}
              </p>
              <h2>
                {item
                  ? 'Your item is listed.'
                  : response
                    ? 'One more thing.'
                    : 'Ready when you are.'}
              </h2>
              <p className="mt-3 text-body">
                {item
                  ? `It now belongs to ${item.shop.name} and is ready to find a new home.`
                  : response && response.status !== 201
                    ? response.body.error
                    : 'Add your details, then list your item in your shop.'}
              </p>
              {response?.status === 400 ? (
                <p className="mt-3 text-sm text-body">
                  Check the highlighted fields and try again.
                </p>
              ) : null}
              {response?.status === 401 ? (
                <p className="mt-3 text-sm text-body">
                  Your details are still here. Sign in before submitting again.
                </p>
              ) : null}
            </div>

            {item ? (
              <div className="space-y-3">
                <ItemCard
                  title={item.title}
                  priceCents={item.priceCents}
                  condition={item.condition}
                  category={item.category.name}
                  seller={item.shop.owner.name}
                  onClick={() => descriptionRef.current?.focus()}
                />
                <section
                  ref={descriptionRef}
                  tabIndex={-1}
                  aria-label="Item description"
                  className="rounded-input bg-tertiary-100 p-4 text-body outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
                >
                  <p>{item.description || 'No description added.'}</p>
                </section>
              </div>
            ) : (
              <div className="rounded-card bg-primary-100 p-6">
                <h2 className="text-tertiary">Small details matter.</h2>
                <p className="mt-3 text-body">
                  Give it a clear name, describe any signs of wear and choose a fair price. Free is
                  welcome, too.
                </p>
              </div>
            )}
            <p className="px-1 text-sm text-body">
              Storybook example. Responses are simulated; no item is saved.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
};
