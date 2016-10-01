QUnit.test( "a test", function( assert ) {
  assert.equal( 1, "1", "String '1' and number 1 have the same value" );
  assert.strictEqual( 1, 1, "1 and 1 have the same value and type" );  
  assert.strictEqual( 1, "1", "1 and \"1\" have not the same value and type" );  
  assert.equal( 0, 0, "Zero, Zero; equal succeeds" );
  assert.equal( "", 0, "Empty, Zero; equal succeeds" );
  assert.equal( "", "", "Empty, Empty; equal succeeds" );
  assert.equal( "three", 3, "Three, 3; equal fails" );
  assert.equal( null, false, "null, false; equal fails" );  

  assert.expect( 2 );
 
  function calc( x, operation ) {
    return operation( x );
  }
 
  var result = calc( 2, function( x ) {
    assert.ok( true, "calc() calls operation function" );
    return x * x;
  });
 
  assert.equal( result, 4, "2 squared equals 4" );
});