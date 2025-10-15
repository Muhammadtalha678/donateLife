'use client';

import { Button } from '@/components/ui/button';
import { EditProfileForm } from '@/components/profile/edit-profile-form';

export function ProfileActions() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 pt-4">
      <EditProfileForm>
        <Button variant="outline" className="w-full">Edit Display Name</Button>
      </EditProfileForm>
      {/* Add other action buttons here in the future */}
    </div>
  );
}
