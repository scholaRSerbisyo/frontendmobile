import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { SubmitProofScreen } from '~/components/ProofSubmissions/SubmitProofScreen'
import { Text } from '~/components/ui/text'

export default function SubmitProof() {
  const { id } = useLocalSearchParams<{ id: string }>()

  if (!id) {
    // Handle the case where no ID is provided
    return <Text>Error: No event ID provided</Text>
  }

  return <SubmitProofScreen eventId={id} />
}

