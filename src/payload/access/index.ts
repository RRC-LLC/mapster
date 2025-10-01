import type { Access, FieldAccess } from "payload";

export const isAdminOrEditor : Access = ({ req: { user }, id }) => {
  // Return true or false based on if the user has an admin role
  return user?.role === 'admin' || user?.role === 'editor';
}

export const isAdminOrEditorOrPublished: Access = ({ req: { user }}) => {
  return user?.role === 'admin' || user?.role === 'editor' ?
    true
   :
    {
      or: [
        {
          _status: {
            equals: 'published',
          },
        },
        {
          _status: {
            exists: false,
          },
        },
      ],
    };
}

export const isAdmin : Access = ({ req: { user } }) => user?.role === 'admin'

export const isAdminFieldLevel : FieldAccess = ({ req: { user } }) => user?.role === 'admin'

export const isAdminOrPublished : Access = ({ req: { user }}) => {
  
  return user?.role === 'admin' ? 
    true :
    {
      or: [
        {
          _status: {
            equals: 'published',
          },
        },
        {
          _status: {
            exists: false,
          },
        },
      ],
  };
  
}

export const userAdminOrEditor: Access = ({ req: { user }, id }) => {
  // Allow users with a role of 'admin'
  return (user?.role === 'admin' || user?.role === 'editor') ? 
    true :
    {
    id: {
      equals: user?.id
    }
  };
}

export const userOrAdmin: Access = ({ req: { user }, id }) => {
  // Allow users with a role of 'admin'
  return (user?.role === 'admin') ? 
    true :
    {
    id: {
      equals: user?.id
    }
  };
}