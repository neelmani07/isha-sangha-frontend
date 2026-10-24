import { useState, type FormEvent } from 'react';
import { PageLayout } from '../../../components/layout/PageLayout';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, Select, Textarea } from '../../../components/ui/Form';
import { Card } from '../../../components/ui/Card';
import { resourcesApi } from '../../../api/resources';
import type { FeedbackType } from '../../../types/api';

export function FeedbackPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<FeedbackType>('GENERAL_FEEDBACK');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Sending...');
    try {
      await resourcesApi.submitFeedback({ name, email, type, message });
      setName('');
      setEmail('');
      setMessage('');
      setStatus('Feedback submitted. Thank you for helping improve the map.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not submit feedback.');
    }
  }

  return (
    <PageLayout
      title="Feedback"
      description="Send a correction, bug report, or feature idea for the Isha World map."
      breadcrumbs={[{ label: 'Globe', to: '/' }, { label: 'Feedback' }]}
    >
      <Card className="max-w-2xl p-6">
        <form onSubmit={submit} className="grid gap-4">
          <FormField label="Name">
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
          </FormField>
          <FormField label="Email">
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              type="email"
            />
          </FormField>
          <FormField label="Type">
            <Select value={type} onChange={(event) => setType(event.target.value as FeedbackType)}>
              <option value="GENERAL_FEEDBACK">General feedback</option>
              <option value="DATA_CORRECTION">Data correction</option>
              <option value="FEATURE_REQUEST">Feature request</option>
              <option value="BUG">Bug</option>
            </Select>
          </FormField>
          <FormField label="Message">
            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Tell us what you noticed or what you'd like to see..."
              required
            />
          </FormField>
          <Button type="submit" className="w-fit">
            Submit feedback
          </Button>
          {status && <p className="text-sm text-ink/70">{status}</p>}
        </form>
      </Card>
    </PageLayout>
  );
}
