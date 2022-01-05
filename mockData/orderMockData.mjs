export default ({relatedLocation, relatedUser, itemRef, itemRef2}) => [
  {
    relatedLocation,
    relatedUser,
    orderTotal: 4.50,
    orderItems: [
      {
        itemRef,
        itemCost: 4.50,
        itemName: 'Item One',
      }
    ],
    deliveryNotes: 'orem ipsum dolor sit amet, consectetur adipiscing elit, se',
    orderNotes: 'orem ipsum dolor sit amet, consectetur adipiscing elit, se',
    orderStatus: 'received',
  },
  {
    relatedLocation,
    relatedUser,
    orderTotal: 8.75,
    orderItems: [
      {
        itemRef,
        itemCost: 4.50,
        itemName: 'Item One',
      },
      {
        itemRef: itemRef2,
        itemCost: 4.25,
        itemName: 'Item Two',
      }
    ],
    deliveryNotes: 'orem ipsum dolor sit amet, consectetur adipiscing elit, se',
    orderNotes: 'orem ipsum dolor sit amet, consectetur adipiscing elit, se',
    orderStatus: 'received',
  }
];