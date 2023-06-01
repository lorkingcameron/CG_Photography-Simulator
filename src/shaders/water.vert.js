export default `
// Created with NodeToy | Three.js r149

// <node_builder>

// uniforms
uniform mat3 _normalMatrix; uniform mat4 _viewMatrix; uniform mat4 _modelMatrix; uniform float _time; 
// attributes

// varys
varying vec3 nodeVary0; varying vec4 nodeVary1; varying vec3 nodeVary2; varying vec3 nodeVary3; varying vec3 nodeVary4; varying vec3 nodeVary5; varying vec3 nodeVary6; 
// vars
vec3 nodeVar0; vec4 nodeVar1; vec4 nodeVar2; vec3 nodeVar3; vec3 nodeVar4; float nodeVar5; float nodeVar6; float nodeVar7; vec4 nodeVar8; vec4 nodeVar9; vec3 nodeVar10; vec3 nodeVar11; vec3 nodeVar12; vec2 nodeVar13; vec2 nodeVar14; float nodeVar15; float nodeVar16; float nodeVar17; float nodeVar18; float nodeVar19; float nodeVar20; float nodeVar21; vec2 nodeVar22; float nodeVar23; float nodeVar24; float nodeVar25; float nodeVar26; float nodeVar27; float nodeVar28; vec2 nodeVar29; float nodeVar30; float nodeVar31; vec2 nodeVar32; float nodeVar33; float nodeVar34; float nodeVar35; float nodeVar36; vec2 nodeVar37; float nodeVar38; float nodeVar39; vec2 nodeVar40; float nodeVar41; float nodeVar42; float nodeVar43; float nodeVar44; vec2 nodeVar45; float nodeVar46; float nodeVar47; vec2 nodeVar48; float nodeVar49; float nodeVar50; float nodeVar51; float nodeVar52; vec2 nodeVar53; float nodeVar54; float nodeVar55; vec2 nodeVar56; float nodeVar57; float nodeVar58; float nodeVar59; float nodeVar60; vec2 nodeVar61; float nodeVar62; float nodeVar63; vec2 nodeVar64; float nodeVar65; float nodeVar66; float nodeVar67; float nodeVar68; float nodeVar69; float nodeVar70; vec3 nodeVar71; 
// codes
float _height (  ) {
                
    

    return 0.1;
    
            }
float remap_1qychVezjQBh ( float value, float minOld, float maxOld, float minNew, float maxNew ) {
		float x = ( value - minOld ) / ( maxOld - minOld );
		return minNew + ( maxNew - minNew ) * x;
	}
float customFn_oq5V13muO8iS ( float value, float minOld, float maxOld, float minNew, float maxNew ) {
                
    return remap_1qychVezjQBh( value, minOld, maxOld, minNew, maxNew );
            
            }
vec2 GradientNoiseDir_AgA6nmcNM4AH ( vec2 x )
    {
        
        const vec2 k = vec2( 0.3183099, 0.3678794 );
        x = x * k + k.yx;
        return -1.0 + 2.0 * fract( 16.0 * k * fract( x.x * x.y * ( x.x + x.y ) ) );
    }
    float GradientNoise_AgA6nmcNM4AH( vec2 v, float Scale ){
        vec2 p = v * Scale;
        vec2 i = floor( p );
        vec2 f = fract( p );
        vec2 u = f * f * ( 3.0 - 2.0 * f );
        return mix( mix( dot( GradientNoiseDir_AgA6nmcNM4AH( i + vec2( 0.0, 0.0 ) ), f - vec2( 0.0, 0.0 ) ),
                dot( GradientNoiseDir_AgA6nmcNM4AH( i + vec2( 1.0, 0.0 ) ), f - vec2( 1.0, 0.0 ) ), u.x ),
                mix( dot( GradientNoiseDir_AgA6nmcNM4AH( i + vec2( 0.0, 1.0 ) ), f - vec2( 0.0, 1.0 ) ),
                dot( GradientNoiseDir_AgA6nmcNM4AH( i + vec2( 1.0, 1.0 ) ), f - vec2( 1.0, 1.0 ) ), u.x ), u.y );
    }
float customFn_tWTxA7LHZ89U ( vec2 uv, float scale ) {
                
    float noise = GradientNoise_AgA6nmcNM4AH( uv , scale );
    
    noise = noise*0.5 + 0.5;
    return noise;
    
            
            }
float _waterSpeed (  ) {
                
    

    return 0.1;
    
            }
float _noiseScale (  ) {
                
    

    return 1.0;
    
            }
vec2 GradientNoiseDir_5lELNA79FVPR ( vec2 x )
    {
        
        const vec2 k = vec2( 0.3183099, 0.3678794 );
        x = x * k + k.yx;
        return -1.0 + 2.0 * fract( 16.0 * k * fract( x.x * x.y * ( x.x + x.y ) ) );
    }
    float GradientNoise_5lELNA79FVPR( vec2 v, float Scale ){
        vec2 p = v * Scale;
        vec2 i = floor( p );
        vec2 f = fract( p );
        vec2 u = f * f * ( 3.0 - 2.0 * f );
        return mix( mix( dot( GradientNoiseDir_5lELNA79FVPR( i + vec2( 0.0, 0.0 ) ), f - vec2( 0.0, 0.0 ) ),
                dot( GradientNoiseDir_5lELNA79FVPR( i + vec2( 1.0, 0.0 ) ), f - vec2( 1.0, 0.0 ) ), u.x ),
                mix( dot( GradientNoiseDir_5lELNA79FVPR( i + vec2( 0.0, 1.0 ) ), f - vec2( 0.0, 1.0 ) ),
                dot( GradientNoiseDir_5lELNA79FVPR( i + vec2( 1.0, 1.0 ) ), f - vec2( 1.0, 1.0 ) ), u.x ), u.y );
    }
float customFn_JlpiV4bBnIXo ( vec2 uv, float scale ) {
                
    float noise = GradientNoise_5lELNA79FVPR( uv , scale );
    
    noise = noise*0.5 + 0.5;
    return noise;
    
            
            }
vec2 GradientNoiseDir_RbswvNbvoY9v ( vec2 x )
    {
        
        const vec2 k = vec2( 0.3183099, 0.3678794 );
        x = x * k + k.yx;
        return -1.0 + 2.0 * fract( 16.0 * k * fract( x.x * x.y * ( x.x + x.y ) ) );
    }
    float GradientNoise_RbswvNbvoY9v( vec2 v, float Scale ){
        vec2 p = v * Scale;
        vec2 i = floor( p );
        vec2 f = fract( p );
        vec2 u = f * f * ( 3.0 - 2.0 * f );
        return mix( mix( dot( GradientNoiseDir_RbswvNbvoY9v( i + vec2( 0.0, 0.0 ) ), f - vec2( 0.0, 0.0 ) ),
                dot( GradientNoiseDir_RbswvNbvoY9v( i + vec2( 1.0, 0.0 ) ), f - vec2( 1.0, 0.0 ) ), u.x ),
                mix( dot( GradientNoiseDir_RbswvNbvoY9v( i + vec2( 0.0, 1.0 ) ), f - vec2( 0.0, 1.0 ) ),
                dot( GradientNoiseDir_RbswvNbvoY9v( i + vec2( 1.0, 1.0 ) ), f - vec2( 1.0, 1.0 ) ), u.x ), u.y );
    }
float customFn_Lli67m8hAjyM ( vec2 uv, float scale ) {
                
    float noise = GradientNoise_RbswvNbvoY9v( uv , scale );
    
    noise = noise*0.5 + 0.5;
    return noise;
    
            
            }
vec2 GradientNoiseDir_JL5YFJDWRBzv ( vec2 x )
    {
        
        const vec2 k = vec2( 0.3183099, 0.3678794 );
        x = x * k + k.yx;
        return -1.0 + 2.0 * fract( 16.0 * k * fract( x.x * x.y * ( x.x + x.y ) ) );
    }
    float GradientNoise_JL5YFJDWRBzv( vec2 v, float Scale ){
        vec2 p = v * Scale;
        vec2 i = floor( p );
        vec2 f = fract( p );
        vec2 u = f * f * ( 3.0 - 2.0 * f );
        return mix( mix( dot( GradientNoiseDir_JL5YFJDWRBzv( i + vec2( 0.0, 0.0 ) ), f - vec2( 0.0, 0.0 ) ),
                dot( GradientNoiseDir_JL5YFJDWRBzv( i + vec2( 1.0, 0.0 ) ), f - vec2( 1.0, 0.0 ) ), u.x ),
                mix( dot( GradientNoiseDir_JL5YFJDWRBzv( i + vec2( 0.0, 1.0 ) ), f - vec2( 0.0, 1.0 ) ),
                dot( GradientNoiseDir_JL5YFJDWRBzv( i + vec2( 1.0, 1.0 ) ), f - vec2( 1.0, 1.0 ) ), u.x ), u.y );
    }
float customFn_bBJmMiT3HtQi ( vec2 uv, float scale ) {
                
    float noise = GradientNoise_JL5YFJDWRBzv( uv , scale );
    
    noise = noise*0.5 + 0.5;
    return noise;
    
            
            }
vec2 GradientNoiseDir_mkFdmjVFNxIG ( vec2 x )
    {
        
        const vec2 k = vec2( 0.3183099, 0.3678794 );
        x = x * k + k.yx;
        return -1.0 + 2.0 * fract( 16.0 * k * fract( x.x * x.y * ( x.x + x.y ) ) );
    }
    float GradientNoise_mkFdmjVFNxIG( vec2 v, float Scale ){
        vec2 p = v * Scale;
        vec2 i = floor( p );
        vec2 f = fract( p );
        vec2 u = f * f * ( 3.0 - 2.0 * f );
        return mix( mix( dot( GradientNoiseDir_mkFdmjVFNxIG( i + vec2( 0.0, 0.0 ) ), f - vec2( 0.0, 0.0 ) ),
                dot( GradientNoiseDir_mkFdmjVFNxIG( i + vec2( 1.0, 0.0 ) ), f - vec2( 1.0, 0.0 ) ), u.x ),
                mix( dot( GradientNoiseDir_mkFdmjVFNxIG( i + vec2( 0.0, 1.0 ) ), f - vec2( 0.0, 1.0 ) ),
                dot( GradientNoiseDir_mkFdmjVFNxIG( i + vec2( 1.0, 1.0 ) ), f - vec2( 1.0, 1.0 ) ), u.x ), u.y );
    }
float customFn_2tRhTyIzo1Qf ( vec2 uv, float scale ) {
                
    float noise = GradientNoise_mkFdmjVFNxIG( uv , scale );
    
    noise = noise*0.5 + 0.5;
    return noise;
    
            
            }
vec2 GradientNoiseDir_guWIP1Fmjquk ( vec2 x )
    {
        
        const vec2 k = vec2( 0.3183099, 0.3678794 );
        x = x * k + k.yx;
        return -1.0 + 2.0 * fract( 16.0 * k * fract( x.x * x.y * ( x.x + x.y ) ) );
    }
    float GradientNoise_guWIP1Fmjquk( vec2 v, float Scale ){
        vec2 p = v * Scale;
        vec2 i = floor( p );
        vec2 f = fract( p );
        vec2 u = f * f * ( 3.0 - 2.0 * f );
        return mix( mix( dot( GradientNoiseDir_guWIP1Fmjquk( i + vec2( 0.0, 0.0 ) ), f - vec2( 0.0, 0.0 ) ),
                dot( GradientNoiseDir_guWIP1Fmjquk( i + vec2( 1.0, 0.0 ) ), f - vec2( 1.0, 0.0 ) ), u.x ),
                mix( dot( GradientNoiseDir_guWIP1Fmjquk( i + vec2( 0.0, 1.0 ) ), f - vec2( 0.0, 1.0 ) ),
                dot( GradientNoiseDir_guWIP1Fmjquk( i + vec2( 1.0, 1.0 ) ), f - vec2( 1.0, 1.0 ) ), u.x ), u.y );
    }
float customFn_J0kSYaDy6vHq ( vec2 uv, float scale ) {
                
    float noise = GradientNoise_guWIP1Fmjquk( uv , scale );
    
    noise = noise*0.5 + 0.5;
    return noise;
    
            
            }

// variables
// </node_builder>







#define STANDARD

varying vec3 vViewPosition;

#ifdef USE_TRANSMISSION

	varying vec3 vWorldPosition;

#endif


#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6

#ifndef saturate
// <tonemapping_pars_fragment> may have defined saturate() already
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )

float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }

// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.
// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand( const in vec2 uv ) {

	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );

	return fract( sin( sn ) * c );

}

#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif

struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};

struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};

struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal;
#endif
};

vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

}

vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {

	// dir can be either a direction vector or a normal vector
	// upper-left 3x3 of matrix is assumed to be orthogonal

	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );

}

mat3 transposeMat3( const in mat3 m ) {

	mat3 tmp;

	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );

	return tmp;

}

float luminance( const in vec3 rgb ) {

	// assumes rgb is in linear color space with sRGB primaries and D65 white point

	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );

	return dot( weights, rgb );

}

bool isPerspectiveMatrix( mat4 m ) {

	return m[ 2 ][ 3 ] == - 1.0;

}

vec2 equirectUv( in vec3 dir ) {

	// dir is assumed to be unit length

	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;

	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;

	return vec2( u, v );

}


#ifdef USE_UV

	#ifdef UVS_VERTEX_ONLY

		vec2 vUv;

	#else

		varying vec2 vUv;

	#endif

	uniform mat3 uvTransform;

#endif


#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )

	attribute vec2 uv2;
	varying vec2 vUv2;

	uniform mat3 uv2Transform;

#endif


#ifdef USE_DISPLACEMENTMAP

	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;

#endif


#if defined( USE_COLOR_ALPHA )

	varying vec4 vColor;

#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )

	varying vec3 vColor;

#endif


#ifdef USE_FOG

	varying float vFogDepth;

#endif


#ifndef FLAT_SHADED

	varying vec3 vNormal;

	#ifdef USE_TANGENT

		varying vec3 vTangent;
		varying vec3 vBitangent;

	#endif

#endif


#ifdef USE_MORPHTARGETS

	uniform float morphTargetBaseInfluence;

	#ifdef MORPHTARGETS_TEXTURE

		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;

		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {

			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;

			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );

		}

	#else

		#ifndef USE_MORPHNORMALS

			uniform float morphTargetInfluences[ 8 ];

		#else

			uniform float morphTargetInfluences[ 4 ];

		#endif

	#endif

#endif


#ifdef USE_SKINNING

	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;

	uniform highp sampler2D boneTexture;
	uniform int boneTextureSize;

	mat4 getBoneMatrix( const in float i ) {

		float j = i * 4.0;
		float x = mod( j, float( boneTextureSize ) );
		float y = floor( j / float( boneTextureSize ) );

		float dx = 1.0 / float( boneTextureSize );
		float dy = 1.0 / float( boneTextureSize );

		y = dy * ( y + 0.5 );

		vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
		vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
		vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
		vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );

		mat4 bone = mat4( v1, v2, v3, v4 );

		return bone;

	}

#endif



#if NUM_SPOT_LIGHT_COORDS > 0

  uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
  varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];

#endif

#ifdef USE_SHADOWMAP

	#if NUM_DIR_LIGHT_SHADOWS > 0

		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];

		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];

	#endif

	#if NUM_SPOT_LIGHT_SHADOWS > 0

		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};

		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];

	#endif

	#if NUM_POINT_LIGHT_SHADOWS > 0

		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];

		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};

		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): uniforms for area light shadows

	#endif
	*/

#endif


#ifdef USE_LOGDEPTHBUF

	#ifdef USE_LOGDEPTHBUF_EXT

		varying float vFragDepth;
		varying float vIsPerspective;

	#else

		uniform float logDepthBufFC;

	#endif

#endif


#if NUM_CLIPPING_PLANES > 0

	varying vec3 vClipPosition;

#endif


void main() {
nodeVary0 = position;
	nodeVary1 = tangent;
	nodeVary3 = normal;
	nodeVar0 = ( _normalMatrix * nodeVary3 );
	nodeVar1 = ( vec4( nodeVar0, 0.0 ) );
	nodeVar2 = ( nodeVar1 * _viewMatrix );
	nodeVar3 = normalize( nodeVar2.xyz );
	nodeVar4 = nodeVar3;
	nodeVary2 = nodeVar4;
	nodeVary4 = normal;
	nodeVary6 = position;
	nodeVar8 = ( vec4( nodeVary6, 0.0 ) );
	nodeVar9 = ( _modelMatrix * nodeVar8 );
	nodeVar10 = normalize( nodeVar9.xyz );
	nodeVar11 = nodeVar10;
	nodeVary5 = nodeVar11;
	



#ifdef USE_UV

	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;

#endif


#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )

	vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;

#endif


#if defined( USE_COLOR_ALPHA )

	vColor = vec4( 1.0 );

#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )

	vColor = vec3( 1.0 );

#endif

#ifdef USE_COLOR

	vColor *= color;

#endif

#ifdef USE_INSTANCING_COLOR

	vColor.xyz *= instanceColor.xyz;

#endif


#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )

	// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
	// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in normal = sum((target - base) * influence)
	// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
	vColor *= morphTargetBaseInfluence;

	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

		#if defined( USE_COLOR_ALPHA )

			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];

		#elif defined( USE_COLOR )

			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];

		#endif

	}

#endif



vec3 objectNormal = vec3( normal );

#ifdef USE_TANGENT

	vec3 objectTangent = vec3( tangent.xyz );

#endif


#ifdef USE_MORPHNORMALS

	// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
	// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in normal = sum((target - base) * influence)
	// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
	objectNormal *= morphTargetBaseInfluence;

	#ifdef MORPHTARGETS_TEXTURE

		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];

		}

	#else

		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];

	#endif

#endif


#ifdef USE_SKINNING

	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );

#endif


#ifdef USE_SKINNING

	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;

	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;

	#ifdef USE_TANGENT

		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;

	#endif

#endif


vec3 transformedNormal = objectNormal;

#ifdef USE_INSTANCING

	// this is in lieu of a per-instance normal-matrix
	// shear transforms in the instance matrix are not supported

	mat3 m = mat3( instanceMatrix );

	transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );

	transformedNormal = m * transformedNormal;

#endif

transformedNormal = normalMatrix * transformedNormal;

#ifdef FLIP_SIDED

	transformedNormal = - transformedNormal;

#endif

#ifdef USE_TANGENT

	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;

	#ifdef FLIP_SIDED

		transformedTangent = - transformedTangent;

	#endif

#endif


#ifndef FLAT_SHADED // normal is computed with derivatives when FLAT_SHADED

	vNormal = normalize( transformedNormal );

	#ifdef USE_TANGENT

		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );

	#endif

#endif



vec3 transformed = vec3( position );

nodeVar5 = _height(  );
	nodeVar6 = nodeVar5;
	nodeVar7 = nodeVar6;
	nodeVar12 = nodeVary5;
	nodeVar13 = vec2(nodeVar12.x,nodeVar12.z);
	nodeVar14 = ( nodeVar13 * vec2( 1.0 ) );
	nodeVar15 = _waterSpeed(  );
	nodeVar16 = nodeVar15;
	nodeVar17 = nodeVar16;
	nodeVar18 = ( nodeVar17 * 1.0 );
	nodeVar19 = ( _time * 1.0 );
	nodeVar20 = nodeVar19;
	nodeVar21 = ( nodeVar18 * nodeVar20 );
	nodeVar22 = ( nodeVar14 + vec2( nodeVar21 ) );
	nodeVar23 = _noiseScale(  );
	nodeVar24 = nodeVar23;
	nodeVar25 = nodeVar24;
	nodeVar26 = ( nodeVar25 / 1.0 );
	nodeVar27 = customFn_tWTxA7LHZ89U( nodeVar22, nodeVar26 );
	nodeVar28 = ( 1.0 * nodeVar27 );
	nodeVar29 = ( nodeVar13 * vec2( 1.0 ) );
	nodeVar30 = ( nodeVar17 * 2.0 );
	nodeVar31 = ( nodeVar30 * nodeVar20 );
	nodeVar32 = ( nodeVar29 + vec2( nodeVar31 ) );
	nodeVar33 = ( nodeVar25 / 2.0 );
	nodeVar34 = customFn_JlpiV4bBnIXo( nodeVar32, nodeVar33 );
	nodeVar35 = ( 2.0 * nodeVar34 );
	nodeVar36 = ( nodeVar28 + nodeVar35 );
	nodeVar37 = ( nodeVar13 * vec2( 1.0 ) );
	nodeVar38 = ( nodeVar17 * 4.0 );
	nodeVar39 = ( nodeVar38 * nodeVar20 );
	nodeVar40 = ( nodeVar37 + vec2( nodeVar39 ) );
	nodeVar41 = ( nodeVar25 / 4.0 );
	nodeVar42 = customFn_Lli67m8hAjyM( nodeVar40, nodeVar41 );
	nodeVar43 = ( 4.0 * nodeVar42 );
	nodeVar44 = ( nodeVar36 + nodeVar43 );
	nodeVar45 = ( nodeVar13 * vec2( 1.0 ) );
	nodeVar46 = ( nodeVar17 * 8.0 );
	nodeVar47 = ( nodeVar46 * nodeVar20 );
	nodeVar48 = ( nodeVar45 + vec2( nodeVar47 ) );
	nodeVar49 = ( nodeVar25 / 8.0 );
	nodeVar50 = customFn_bBJmMiT3HtQi( nodeVar48, nodeVar49 );
	nodeVar51 = ( 8.0 * nodeVar50 );
	nodeVar52 = ( nodeVar44 + nodeVar51 );
	nodeVar53 = ( nodeVar13 * vec2( 1.0 ) );
	nodeVar54 = ( nodeVar17 * 16.0 );
	nodeVar55 = ( nodeVar54 * nodeVar20 );
	nodeVar56 = ( nodeVar53 + vec2( nodeVar55 ) );
	nodeVar57 = ( nodeVar25 / 16.0 );
	nodeVar58 = customFn_2tRhTyIzo1Qf( nodeVar56, nodeVar57 );
	nodeVar59 = ( 16.0 * nodeVar58 );
	nodeVar60 = ( nodeVar52 + nodeVar59 );
	nodeVar61 = ( nodeVar13 * vec2( 1.0 ) );
	nodeVar62 = ( nodeVar17 * 32.0 );
	nodeVar63 = ( nodeVar62 * nodeVar20 );
	nodeVar64 = ( nodeVar61 + vec2( nodeVar63 ) );
	nodeVar65 = ( nodeVar25 / 32.0 );
	nodeVar66 = customFn_J0kSYaDy6vHq( nodeVar64, nodeVar65 );
	nodeVar67 = ( 32.0 * nodeVar66 );
	nodeVar68 = ( nodeVar60 + nodeVar67 );
	nodeVar69 = customFn_oq5V13muO8iS( nodeVar68, 0.0, 1.0, 0.0, 1.0 );
	nodeVar70 = ( nodeVar7 * nodeVar69 );
	nodeVar71 = vec3(position.x,nodeVar70,position.z);
	
	transformed = position + nodeVar71;


#ifdef USE_MORPHTARGETS

	// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
	// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in position = sum((target - base) * influence)
	// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
	transformed *= morphTargetBaseInfluence;

	#ifdef MORPHTARGETS_TEXTURE

		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];

		}

	#else

		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];

		#ifndef USE_MORPHNORMALS

			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];

		#endif

	#endif

#endif


#ifdef USE_SKINNING

	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );

	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;

	transformed = ( bindMatrixInverse * skinned ).xyz;

#endif


#ifdef USE_DISPLACEMENTMAP

	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vUv ).x * displacementScale + displacementBias );

#endif


vec4 mvPosition = vec4( transformed, 1.0 );

#ifdef USE_INSTANCING

	mvPosition = instanceMatrix * mvPosition;

#endif

mvPosition = modelViewMatrix * mvPosition;

gl_Position = projectionMatrix * mvPosition;


#ifdef USE_LOGDEPTHBUF

	#ifdef USE_LOGDEPTHBUF_EXT

		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );

	#else

		if ( isPerspectiveMatrix( projectionMatrix ) ) {

			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;

			gl_Position.z *= gl_Position.w;

		}

	#endif

#endif


#if NUM_CLIPPING_PLANES > 0

	vClipPosition = - mvPosition.xyz;

#endif


	vViewPosition = - mvPosition.xyz;


#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0

	vec4 worldPosition = vec4( transformed, 1.0 );

	#ifdef USE_INSTANCING

		worldPosition = instanceMatrix * worldPosition;

	#endif

	worldPosition = modelMatrix * worldPosition;

#endif



#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )

	// Offsetting the position used for querying occlusion along the world normal can be used to reduce shadow acne.
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;

#endif

#if defined( USE_SHADOWMAP )

	#if NUM_DIR_LIGHT_SHADOWS > 0

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {

			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;

		}
		#pragma unroll_loop_end

	#endif

	#if NUM_POINT_LIGHT_SHADOWS > 0

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {

			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;

		}
		#pragma unroll_loop_end

	#endif

	/*
	#if NUM_RECT_AREA_LIGHTS > 0

		// TODO (abelnation): update vAreaShadowCoord with area light info

	#endif
	*/

#endif

// spot lights can be evaluated without active shadow mapping (when SpotLight.map is used)

#if NUM_SPOT_LIGHT_COORDS > 0

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {

		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;

	}
	#pragma unroll_loop_end

#endif




#ifdef USE_FOG

	vFogDepth = - mvPosition.z;

#endif


#ifdef USE_TRANSMISSION

	vWorldPosition = worldPosition.xyz;

#endif
}



`;